## Feature transformation with Amazon SageMaker processing job and Feature Store

### Introduction

In this lab you will start with the raw [Women's Clothing Reviews](https://www.kaggle.com/nicapotato/womens-ecommerce-clothing-reviews) dataset and prepare it to train a BERT-based natural language processing (NLP) model. The model will be used to classify customer reviews into positive (1), neutral (0) and negative (-1) sentiment.

You will convert the original review text into machine-readable features used by BERT. To perform the required feature transformation you will configure an Amazon SageMaker processing job, which will be running a custom Python script.





```python
# please ignore warning messages during the installation
!pip install --disable-pip-version-check -q sagemaker==2.35.0
!conda install -q -y pytorch==1.6.0 -c pytorch
!pip install --disable-pip-version-check -q transformers==3.5.1
```

    [33mWARNING: Running pip as the 'root' user can result in broken permissions and conflicting behaviour with the system package manager. It is recommended to use a virtual environment instead: https://pip.pypa.io/warnings/venv[0m[33m
    [0mCollecting package metadata (current_repodata.json): ...working... done
    Solving environment: ...working... failed with initial frozen solve. Retrying with flexible solve.
    Collecting package metadata (repodata.json): ...working... done
    Solving environment: ...working... done
    
    ## Package Plan ##
    
      environment location: /opt/conda
    
      added / updated specs:
        - pytorch==1.6.0
    
    
    The following packages will be downloaded:
    
        package                    |            build
        ---------------------------|-----------------
        ca-certificates-2023.05.30 |       h06a4308_0         120 KB
        certifi-2022.12.7          |   py37h06a4308_0         150 KB
        cudatoolkit-10.2.89        |       hfd86e86_1       365.1 MB
        ninja-1.10.2               |       h06a4308_5           8 KB
        ninja-base-1.10.2          |       hd09550d_5         109 KB
        pytorch-1.6.0              |py3.7_cuda10.2.89_cudnn7.6.5_0       537.7 MB  pytorch
        ------------------------------------------------------------
                                               Total:       903.1 MB
    
    The following NEW packages will be INSTALLED:
    
      cudatoolkit        pkgs/main/linux-64::cudatoolkit-10.2.89-hfd86e86_1 None
      ninja              pkgs/main/linux-64::ninja-1.10.2-h06a4308_5 None
      ninja-base         pkgs/main/linux-64::ninja-base-1.10.2-hd09550d_5 None
      pytorch            pytorch/linux-64::pytorch-1.6.0-py3.7_cuda10.2.89_cudnn7.6.5_0 None
    
    The following packages will be UPDATED:
    
      ca-certificates    conda-forge::ca-certificates-2022.12.~ --> pkgs/main::ca-certificates-2023.05.30-h06a4308_0 None
    
    The following packages will be SUPERSEDED by a higher-priority channel:
    
      certifi            conda-forge/noarch::certifi-2022.12.7~ --> pkgs/main/linux-64::certifi-2022.12.7-py37h06a4308_0 None
    
    
    Preparing transaction: ...working... done
    Verifying transaction: ...working... done
    Executing transaction: ...working... done
    Retrieving notices: ...working... done
    [33mWARNING: Running pip as the 'root' user can result in broken permissions and conflicting behaviour with the system package manager. It is recommended to use a virtual environment instead: https://pip.pypa.io/warnings/venv[0m[33m
    [0m


```python
import boto3
import sagemaker
import botocore

config = botocore.config.Config(user_agent_extra='dlai-pds/c2/w1')

# low-level service client of the boto3 session
sm = boto3.client(service_name='sagemaker', 
                  config=config)

featurestore_runtime = boto3.client(service_name='sagemaker-featurestore-runtime', 
                                    config=config)

sess = sagemaker.Session(sagemaker_client=sm,
                         sagemaker_featurestore_runtime_client=featurestore_runtime)

bucket = sess.default_bucket()
role = sagemaker.get_execution_role()
region = sess.boto_region_name
```

<a name='c2w1-1.'></a>
# 1. Configure the SageMaker Feature Store

<a name='c2w1-1.1.'></a>
### 1.1. Configure dataset
The raw dataset is in the public S3 bucket. Let's start by specifying the S3 location of it:


```python
raw_input_data_s3_uri = 's3://dlai-practical-data-science/data/raw/'
print(raw_input_data_s3_uri)
```

    s3://dlai-practical-data-science/data/raw/


List the files in the S3 bucket (in this case it will be just one file):


```python
!aws s3 ls $raw_input_data_s3_uri
```

    2021-04-30 02:21:06    8457214 womens_clothing_ecommerce_reviews.csv


<a name='c2w1-1.2.'></a>
### 1.2. Configure the SageMaker feature store

As the result of the transformation, in addition to generating files in S3 bucket, you will also save the transformed data in the **Amazon SageMaker Feature Store** to be used by others in your organization, for example. 

To configure a Feature Store you need to setup a **Feature Group**. This is the main resource containing all of the metadata related to the data stored in the Feature Store. A Feature Group should contain a list of **Feature Definitions**. A Feature Definition consists of a name and the data type. The Feature Group also contains an online store configuration and an offline store configuration controlling where the data is stored. Enabling the online store allows quick access to the latest value for a record via the [GetRecord API](https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_feature_store_GetRecord.html). The offline store allows storage of the data in your S3 bucket. You will be using the offline store in this lab.

Let's setup the Feature Group name and the Feature Store offline prefix in S3 bucket (you will use those later in the lab):


```python
import time
timestamp = int(time.time())

feature_group_name = 'reviews-feature-group-' + str(timestamp)
feature_store_offline_prefix = 'reviews-feature-store-' + str(timestamp)

print('Feature group name: {}'.format(feature_group_name))
print('Feature store offline prefix in S3: {}'.format(feature_store_offline_prefix))
```

    Feature group name: reviews-feature-group-1686463816
    Feature store offline prefix in S3: reviews-feature-store-1686463816


Taking two features from the original raw dataset (`Review Text` and `Rating`), you will transform it preparing to be used for the model training and then to be saved in the Feature Store. Here you will define the related features to be stored as a list of `FeatureDefinition`.


```python
from sagemaker.feature_store.feature_definition import (
    FeatureDefinition,
    FeatureTypeEnum,
)

feature_definitions= [
    # unique ID of the review
    FeatureDefinition(feature_name='review_id', feature_type=FeatureTypeEnum.STRING), 
    # ingestion timestamp
    FeatureDefinition(feature_name='date', feature_type=FeatureTypeEnum.STRING),
    # sentiment: -1 (negative), 0 (neutral) or 1 (positive). It will be found the Rating values (1, 2, 3, 4, 5)
    FeatureDefinition(feature_name='sentiment', feature_type=FeatureTypeEnum.STRING), 
    # label ID of the target class (sentiment)
    FeatureDefinition(feature_name='label_id', feature_type=FeatureTypeEnum.STRING),
    # reviews encoded with the BERT tokenizer
    FeatureDefinition(feature_name='input_ids', feature_type=FeatureTypeEnum.STRING),
    # original Review Text
    FeatureDefinition(feature_name='review_body', feature_type=FeatureTypeEnum.STRING),
    # train/validation/test label
    FeatureDefinition(feature_name='split_type', feature_type=FeatureTypeEnum.STRING)
]
```

<a name='c2w1-ex-1'></a>
### Exercise 1

Create the feature group using the feature definitions defined above.

**Instructions:** Use the `FeatureGroup` function passing the defined above feature group name and the feature definitions.

```python
feature_group = FeatureGroup(
    name=..., # Feature Group name
    feature_definitions=..., # a list of Feature Definitions
    sagemaker_session=sess # SageMaker session
)
```


```python
from sagemaker.feature_store.feature_group import FeatureGroup

feature_group = FeatureGroup(
    ### BEGIN SOLUTION - DO NOT delete this comment for grading purposes
    name=feature_group_name, # Replace None
    feature_definitions=feature_definitions, # Replace None
    ### END SOLUTION - DO NOT delete this comment for grading purposes
    sagemaker_session=sess
)

print(feature_group)
```

    FeatureGroup(name='reviews-feature-group-1686463816', sagemaker_session=<sagemaker.session.Session object at 0x7f0b3d12bd50>, feature_definitions=[FeatureDefinition(feature_name='review_id', feature_type=<FeatureTypeEnum.STRING: 'String'>), FeatureDefinition(feature_name='date', feature_type=<FeatureTypeEnum.STRING: 'String'>), FeatureDefinition(feature_name='sentiment', feature_type=<FeatureTypeEnum.STRING: 'String'>), FeatureDefinition(feature_name='label_id', feature_type=<FeatureTypeEnum.STRING: 'String'>), FeatureDefinition(feature_name='input_ids', feature_type=<FeatureTypeEnum.STRING: 'String'>), FeatureDefinition(feature_name='review_body', feature_type=<FeatureTypeEnum.STRING: 'String'>), FeatureDefinition(feature_name='split_type', feature_type=<FeatureTypeEnum.STRING: 'String'>)])


You will use the defined Feature Group later in this lab, the actual creation of the Feature Group will take place in the processing job. Now let's move into the setup of the processing job to transform the dataset.

<a name='c2w1-2.'></a>
# 2. Transform the dataset

You will configure a SageMaker processing job to run a custom Python script to balance and transform the raw data into a format used by BERT model.

Set the transformation parameters including the instance type, instance count, and train/validation/test split percentages. For the purposes of this lab, you will use a relatively small instance type. Please refer to [this](https://aws.amazon.com/sagemaker/pricing/) link for additional instance types that may work for your use case outside of this lab.

You can also choose whether you want to balance the dataset or not. In this case, you will balance the dataset to avoid class imbalance in the target variable, `sentiment`. 

Another important parameter of the model is the `max_seq_length`, which specifies the maximum length of the classified reviews for the RoBERTa model. If the sentence is shorter than the maximum length parameter, it will be padded. In another case, when the sentence is longer, it will be truncated from the right side.

Since a smaller `max_seq_length` leads to faster training and lower resource utilization, you want to find the smallest power-of-2 that captures `100%` of our reviews.  For this dataset, the `100th` percentile is `115`.  However, it's best to stick with powers-of-2 when using BERT. So let's choose `128` as this is the smallest power-of-2 greater than `115`. You will see below how the shorter sentences will be padded to a maximum length.


```
mean        52.512374
std         31.387048
min          1.000000
10%         10.000000
20%         22.000000
30%         32.000000
40%         41.000000
50%         51.000000
60%         61.000000
70%         73.000000
80%         88.000000
90%         97.000000
100%       115.000000
max        115.000000
```

![](images/distribution_num_words_per_review.png)



```python
processing_instance_type='ml.c5.xlarge'
processing_instance_count=1
train_split_percentage=0.90
validation_split_percentage=0.05
test_split_percentage=0.05
balance_dataset=True
max_seq_length=128
```

To balance and transform our data, you will use a scikit-learn-based processing job. This is essentially a generic Python processing job with scikit-learn pre-installed. You can specify the version of scikit-learn you wish to use. Also pass the SageMaker execution role, processing instance type and instance count.


```python
from sagemaker.sklearn.processing import SKLearnProcessor

processor = SKLearnProcessor(
    framework_version='0.23-1',
    role=role,
    instance_type=processing_instance_type,
    instance_count=processing_instance_count,
    env={'AWS_DEFAULT_REGION': region},                             
    max_runtime_in_seconds=7200
)
```

The processing job will be running the Python code from the file `src/prepare_data.py`. In the following exercise you will review the contents of the file and familiarize yourself with main parts of it. 

<a name='c2w1-ex-2'></a>
### Exercise 2

1. Open the file [src/prepare_data.py](src/prepare_data.py). Go through the comments to understand its content.
2. Find and review the `convert_to_bert_input_ids()` function, which contains the RoBERTa `tokenizer` configuration.
3. Complete method `encode_plus` of the RoBERTa `tokenizer`. Pass the `max_seq_length` as a value for the argument `max_length`. It defines a pad to a maximum length specified.
4. Save the file [src/prepare_data.py](src/prepare_data.py) (with the menu command File -> Save Python File).

### _This cell will take approximately 1-2 minutes to run._


```python
import sys, importlib
sys.path.append('src/')

# import the `prepare_data.py` module
import prepare_data

# reload the module if it has been previously loaded 
if 'prepare_data' in sys.modules:
    importlib.reload(prepare_data)

input_ids = prepare_data.convert_to_bert_input_ids("this product is great!", max_seq_length)
    
updated_correctly = False

if len(input_ids) != max_seq_length:
    print('#######################################################################################################')
    print('Please check that the function \'convert_to_bert_input_ids\' in the file src/prepare_data.py is complete.')
    print('#######################################################################################################')
    raise Exception('Please check that the function \'convert_to_bert_input_ids\' in the file src/prepare_data.py is complete.')
else:
    print('##################')
    print('Updated correctly!')
    print('##################')

    updated_correctly = True
```


    HBox(children=(FloatProgress(value=0.0, description='Downloading', max=898823.0, style=ProgressStyle(descripti…


    



    HBox(children=(FloatProgress(value=0.0, description='Downloading', max=456318.0, style=ProgressStyle(descripti…


    
    ##################
    Updated correctly!
    ##################


Review the results of tokenization for the given example (*\"this product is great!\"*):


```python
input_ids = prepare_data.convert_to_bert_input_ids("this product is great!", max_seq_length)

print(input_ids)
print('Length of the sequence: {}'.format(len(input_ids)))
```

    [0, 9226, 1152, 16, 372, 328, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    Length of the sequence: 128


Launch the processing job with the custom script passing defined above parameters.


```python
from sagemaker.processing import ProcessingInput, ProcessingOutput

if (updated_correctly):

    processor.run(code='src/prepare_data.py',
              inputs=[
                    ProcessingInput(source=raw_input_data_s3_uri,
                                    destination='/opt/ml/processing/input/data/',
                                    s3_data_distribution_type='ShardedByS3Key')
              ],
              outputs=[
                    ProcessingOutput(output_name='sentiment-train',
                                     source='/opt/ml/processing/output/sentiment/train',
                                     s3_upload_mode='EndOfJob'),
                    ProcessingOutput(output_name='sentiment-validation',
                                     source='/opt/ml/processing/output/sentiment/validation',
                                     s3_upload_mode='EndOfJob'),
                    ProcessingOutput(output_name='sentiment-test',
                                     source='/opt/ml/processing/output/sentiment/test',
                                     s3_upload_mode='EndOfJob')
              ],
              arguments=['--train-split-percentage', str(train_split_percentage),
                         '--validation-split-percentage', str(validation_split_percentage),
                         '--test-split-percentage', str(test_split_percentage),
                         '--balance-dataset', str(balance_dataset),
                         '--max-seq-length', str(max_seq_length),                         
                         '--feature-store-offline-prefix', str(feature_store_offline_prefix),
                         '--feature-group-name', str(feature_group_name)                         
              ],
              logs=True,
              wait=False)

else:
    print('#######################################')
    print('Please update the code correctly above.')
    print('#######################################')    
```

    
    Job Name:  sagemaker-scikit-learn-2023-06-11-06-19-29-466
    Inputs:  [{'InputName': 'input-1', 'AppManaged': False, 'S3Input': {'S3Uri': 's3://dlai-practical-data-science/data/raw/', 'LocalPath': '/opt/ml/processing/input/data/', 'S3DataType': 'S3Prefix', 'S3InputMode': 'File', 'S3DataDistributionType': 'ShardedByS3Key', 'S3CompressionType': 'None'}}, {'InputName': 'code', 'AppManaged': False, 'S3Input': {'S3Uri': 's3://sagemaker-us-east-1-047418094836/sagemaker-scikit-learn-2023-06-11-06-19-29-466/input/code/prepare_data.py', 'LocalPath': '/opt/ml/processing/input/code', 'S3DataType': 'S3Prefix', 'S3InputMode': 'File', 'S3DataDistributionType': 'FullyReplicated', 'S3CompressionType': 'None'}}]
    Outputs:  [{'OutputName': 'sentiment-train', 'AppManaged': False, 'S3Output': {'S3Uri': 's3://sagemaker-us-east-1-047418094836/sagemaker-scikit-learn-2023-06-11-06-19-29-466/output/sentiment-train', 'LocalPath': '/opt/ml/processing/output/sentiment/train', 'S3UploadMode': 'EndOfJob'}}, {'OutputName': 'sentiment-validation', 'AppManaged': False, 'S3Output': {'S3Uri': 's3://sagemaker-us-east-1-047418094836/sagemaker-scikit-learn-2023-06-11-06-19-29-466/output/sentiment-validation', 'LocalPath': '/opt/ml/processing/output/sentiment/validation', 'S3UploadMode': 'EndOfJob'}}, {'OutputName': 'sentiment-test', 'AppManaged': False, 'S3Output': {'S3Uri': 's3://sagemaker-us-east-1-047418094836/sagemaker-scikit-learn-2023-06-11-06-19-29-466/output/sentiment-test', 'LocalPath': '/opt/ml/processing/output/sentiment/test', 'S3UploadMode': 'EndOfJob'}}]


You can see the information about the processing jobs using the `describe` function. The result is in dictionary format. Let's pull the processing job name:


```python
scikit_processing_job_name = processor.jobs[-1].describe()['ProcessingJobName']

print('Processing job name: {}'.format(scikit_processing_job_name))
```

    Processing job name: sagemaker-scikit-learn-2023-06-11-06-19-29-466


<a name='c2w1-ex-3'></a>
### Exercise 3

Pull the processing job status from the processing job description.

**Instructions**: Print the keys of the processing job description dictionary, choose the one related to the status of the processing job and print the value of it.


```python
print(processor.jobs[-1].describe().keys())
```

    dict_keys(['ProcessingInputs', 'ProcessingOutputConfig', 'ProcessingJobName', 'ProcessingResources', 'StoppingCondition', 'AppSpecification', 'Environment', 'RoleArn', 'ProcessingJobArn', 'ProcessingJobStatus', 'LastModifiedTime', 'CreationTime', 'ResponseMetadata'])



```python
### BEGIN SOLUTION - DO NOT delete this comment for grading purposes
scikit_processing_job_status = processor.jobs[-1].describe()['ProcessingJobStatus'] # Replace None
### END SOLUTION - DO NOT delete this comment for grading purposes
print('Processing job status: {}'.format(scikit_processing_job_status))
```

    Processing job status: InProgress


Review the created processing job in the AWS console.

**Instructions**: 
- open the link
- notice that you are in the section `Amazon SageMaker` -> `Processing jobs`
- check the name of the processing job, its status and other available information


```python
from IPython.core.display import display, HTML

display(HTML('<b>Review <a target="blank" href="https://console.aws.amazon.com/sagemaker/home?region={}#/processing-jobs/{}">processing job</a></b>'.format(region, scikit_processing_job_name)))
```


<b>Review <a target="blank" href="https://console.aws.amazon.com/sagemaker/home?region=us-east-1#/processing-jobs/sagemaker-scikit-learn-2023-06-11-06-19-29-466">processing job</a></b>


Wait for about 5 minutes to review the CloudWatch Logs. You may open the file [src/prepare_data.py](src/prepare_data.py) again and examine the outputs of the code in the CloudWatch logs.


```python
from IPython.core.display import display, HTML

display(HTML('<b>Review <a target="blank" href="https://console.aws.amazon.com/cloudwatch/home?region={}#logStream:group=/aws/sagemaker/ProcessingJobs;prefix={};streamFilter=typeLogStreamPrefix">CloudWatch logs</a> after about 5 minutes</b>'.format(region, scikit_processing_job_name)))
```


<b>Review <a target="blank" href="https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#logStream:group=/aws/sagemaker/ProcessingJobs;prefix=sagemaker-scikit-learn-2023-06-11-06-19-29-466;streamFilter=typeLogStreamPrefix">CloudWatch logs</a> after about 5 minutes</b>


After the completion of the processing job you can also review the output in the S3 bucket.


```python
from IPython.core.display import display, HTML

display(HTML('<b>Review <a target="blank" href="https://s3.console.aws.amazon.com/s3/buckets/{}/{}/?region={}&tab=overview">S3 output data</a> after the processing job has completed</b>'.format(bucket, scikit_processing_job_name, region)))

```


<b>Review <a target="blank" href="https://s3.console.aws.amazon.com/s3/buckets/sagemaker-us-east-1-047418094836/sagemaker-scikit-learn-2023-06-11-06-19-29-466/?region=us-east-1&tab=overview">S3 output data</a> after the processing job has completed</b>


Wait for the processing job to complete.

### _This cell will take approximately 15 minutes to run._


```python
%%time

running_processor = sagemaker.processing.ProcessingJob.from_processing_name(
    processing_job_name=scikit_processing_job_name,
    sagemaker_session=sess
)

running_processor.wait(logs=False)
```

    ................................................................................!CPU times: user 367 ms, sys: 20.1 ms, total: 387 ms
    Wall time: 6min 45s


_Please wait until ^^ Processing Job ^^ completes above_

Inspect the transformed and balanced data in the S3 bucket.


```python
processing_job_description = running_processor.describe()

output_config = processing_job_description['ProcessingOutputConfig']
for output in output_config['Outputs']:
    if output['OutputName'] == 'sentiment-train':
        processed_train_data_s3_uri = output['S3Output']['S3Uri']
    if output['OutputName'] == 'sentiment-validation':
        processed_validation_data_s3_uri = output['S3Output']['S3Uri']
    if output['OutputName'] == 'sentiment-test':
        processed_test_data_s3_uri = output['S3Output']['S3Uri']
        
print(processed_train_data_s3_uri)
print(processed_validation_data_s3_uri)
print(processed_test_data_s3_uri)
```

    s3://sagemaker-us-east-1-047418094836/sagemaker-scikit-learn-2023-06-11-06-19-29-466/output/sentiment-train
    s3://sagemaker-us-east-1-047418094836/sagemaker-scikit-learn-2023-06-11-06-19-29-466/output/sentiment-validation
    s3://sagemaker-us-east-1-047418094836/sagemaker-scikit-learn-2023-06-11-06-19-29-466/output/sentiment-test



```python
!aws s3 ls $processed_train_data_s3_uri/
```

    2023-06-11 06:32:30    4898781 part-algo-1-womens_clothing_ecommerce_reviews.tsv



```python
!aws s3 ls $processed_validation_data_s3_uri/
```

    2023-06-11 06:32:30     270676 part-algo-1-womens_clothing_ecommerce_reviews.tsv



```python
!aws s3 ls $processed_test_data_s3_uri/
```

    2023-06-11 06:32:31     273383 part-algo-1-womens_clothing_ecommerce_reviews.tsv


Copy the data into the folder `balanced`.


```python
!aws s3 cp $processed_train_data_s3_uri/part-algo-1-womens_clothing_ecommerce_reviews.tsv ./balanced/sentiment-train/
!aws s3 cp $processed_validation_data_s3_uri/part-algo-1-womens_clothing_ecommerce_reviews.tsv ./balanced/sentiment-validation/
!aws s3 cp $processed_test_data_s3_uri/part-algo-1-womens_clothing_ecommerce_reviews.tsv ./balanced/sentiment-test/
```

    download: s3://sagemaker-us-east-1-047418094836/sagemaker-scikit-learn-2023-06-11-06-19-29-466/output/sentiment-train/part-algo-1-womens_clothing_ecommerce_reviews.tsv to balanced/sentiment-train/part-algo-1-womens_clothing_ecommerce_reviews.tsv
    download: s3://sagemaker-us-east-1-047418094836/sagemaker-scikit-learn-2023-06-11-06-19-29-466/output/sentiment-validation/part-algo-1-womens_clothing_ecommerce_reviews.tsv to balanced/sentiment-validation/part-algo-1-womens_clothing_ecommerce_reviews.tsv
    download: s3://sagemaker-us-east-1-047418094836/sagemaker-scikit-learn-2023-06-11-06-19-29-466/output/sentiment-test/part-algo-1-womens_clothing_ecommerce_reviews.tsv to balanced/sentiment-test/part-algo-1-womens_clothing_ecommerce_reviews.tsv


Review the training, validation and test data outputs:


```python
!head -n 5 ./balanced/sentiment-train/part-algo-1-womens_clothing_ecommerce_reviews.tsv
```

    review_id	sentiment	label_id	input_ids	review_body	date
    12096	1	2	[0, 45065, 16, 372, 1437, 10698, 182, 157, 23, 3844, 1437, 939, 524, 195, 108, 306, 16157, 17243, 2162, 1836, 290, 642, 8, 24, 18, 205, 734, 939, 74, 2703, 3568, 8872, 25, 24, 11541, 8, 6476, 15, 5, 1929, 4, 51, 32, 55, 1136, 73, 36741, 73, 31421, 9304, 25, 1468, 1341, 7992, 4, 1374, 1437, 939, 524, 1372, 19, 106, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]	Quality is great  fits very well at waste  i am 5'4 135lb bought size 8p and it's good... i would require wear heels as it reaches and sits on the floor. they are more fall/spring/winter pants as material quite thick. overall  i am happy with them	2023-06-11T06:26:11Z
    10118	-1	0	[0, 713, 3588, 34, 1256, 8089, 4, 5, 299, 2564, 157, 53, 5, 2576, 1415, 101, 41, 7237, 159, 16676, 4, 24, 34, 615, 1468, 7, 146, 132, 31296, 8, 5, 380, 12189, 15, 5, 2380, 146, 5, 16576, 4757, 66, 29445, 4, 5, 1345, 9, 1421, 16, 31, 526, 1437, 45, 5, 760, 4, 182, 29747, 24203, 15, 162, 4, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]	This dress has pretty colors. the top fit well but the bottom looked like an upside down umbrella. it has enough material to make 2 skirts and the big pockets on the sides make the skirt stick out sideways. the photo of model is from side  not the front. very unflattering on me.	2023-06-11T06:26:11Z
    7852	-1	0	[0, 347, 4467, 11, 6680, 1437, 939, 657, 5, 4520, 8089, 1437, 5, 3016, 909, 19008, 579, 1671, 8, 5, 1510, 18, 16464, 1437, 959, 1437, 5, 10199, 16, 6162, 1437, 8, 5, 2373, 233, 11, 127, 1217, 16, 14, 5, 39336, 14, 422, 552, 5, 760, 1312, 9, 5, 6399, 109, 45, 12432, 5, 6184, 4, 2085, 42, 21, 18797, 1437, 53, 19, 5, 6399, 939, 829, 1437, 24, 1415, 11385, 4, 939, 1051, 24, 124, 4, 939, 3120, 11, 5, 2170, 14, 5, 909, 3405, 32, 19055, 2325, 81, 5, 1312, 760, 27595, 1437, 98, 24, 16, 10, 828, 34575, 9404, 4, 939, 1979, 75, 907, 42, 299, 23, 143, 425, 716, 15, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]	Cute in theory  i love the bright colors  the tied black collar sash and the 70's vibe  however  the fabric is cheap  and the worst part in my view is that the seams that run along the front center of the shirt do not align the pattern. maybe this was intentional  but with the shirt i received  it looked horrible. i sent it back. i notice in the picture that the black ties are strategically placed over the center front seam  so it is a bit deceiving. i wouldn't buy this top at any price based on	2023-06-11T06:26:11Z
    8068	1	2	[0, 19065, 8089, 1437, 2496, 8, 2564, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]	Great colors  style and fit	2023-06-11T06:26:11Z



```python
!head -n 5 ./balanced/sentiment-validation/part-algo-1-womens_clothing_ecommerce_reviews.tsv
```

    review_id	sentiment	label_id	input_ids	review_body	date
    12126	1	2	[0, 713, 16, 804, 5451, 98, 939, 2740, 258, 10070, 3023, 29, 8, 579, 4, 24, 1237, 1256, 739, 98, 939, 1682, 1836, 3023, 29, 4, 5, 1468, 64, 28, 13596, 4, 53, 939, 101, 5, 2157, 9, 24, 8, 182, 3473, 7, 110, 3024, 4, 939, 524, 98, 1372, 2806, 98, 171, 33391, 11263, 939, 213, 16506, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]	This is online exclusive so i ordered both sizes xs and s. it runs pretty large so i kept size xs. the material can be stretched. but i like the feeling of it and very comfortable to your skin. i am so happy receiving so many compliments wherever i go!!!	2023-06-11T06:26:11Z
    2430	0	1	[0, 100, 2162, 155, 9, 209, 13657, 11, 430, 8089, 1437, 5, 2440, 65, 56, 65, 24150, 28840, 10941, 4, 1051, 24, 124, 4, 122, 540, 87, 158, 360, 423, 51, 32, 15, 1392, 4, 5, 2496, 16, 30213, 8, 120, 171, 14156, 2963, 15, 5, 80, 939, 33, 4, 856, 28831, 939, 437, 10, 2491, 417, 8325, 29882, 8, 5679, 2564, 372, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]	I bought 3 of these tops in different colors  the blue one had one sleeve noticeably shorter. sent it back. now less than 10 days later they are on sale. the style is darling and get many complements on the two i have. fyi i'm a 36d 130lbs and med fit great	2023-06-11T06:26:11Z
    4395	-1	0	[0, 100, 794, 42, 15, 10, 313, 858, 18017, 11, 5, 1400, 8, 98, 770, 24, 7, 173, 53, 21, 95, 350, 24901, 8, 35156, 4, 182, 205, 1318, 8, 1468, 4, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]	I saw this on a mannequin in the store and so wanted it to work but was just too oversized and bulky. very good quality and material.	2023-06-11T06:26:11Z
    2386	1	2	[0, 597, 20554, 833, 53, 45, 350, 856, 28102, 13454, 16, 10, 2579, 37919, 12, 3341, 1468, 4, 939, 300, 5, 1104, 65, 61, 40, 213, 19, 10, 319, 9, 127, 31296, 1437, 9304, 8, 13344, 4, 7328, 97, 34910, 1437, 939, 399, 75, 465, 24, 350, 765, 13, 162, 23, 70, 1437, 53, 939, 524, 239, 12, 2739, 15346, 4, 9881, 53, 19, 30109, 4, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]	Feminine but not too fussy tee is a nice linen-like material. i got the white one which will go with a lot of my skirts  pants and shorts. unlike other reviewers  i didn't find it too short for me at all  but i am high-waisted. casual but with extras.	2023-06-11T06:26:11Z



```python
!head -n 5 ./balanced/sentiment-test/part-algo-1-womens_clothing_ecommerce_reviews.tsv
```

    review_id	sentiment	label_id	input_ids	review_body	date
    14693	-1	0	[0, 100, 269, 770, 7, 657, 42, 6399, 328, 5, 8089, 32, 12058, 1437, 182, 11577, 8, 95, 25, 2343, 4, 5, 2564, 21, 70, 1593, 15, 162, 4, 939, 2740, 5, 4716, 1459, 37863, 29, 8, 24, 21, 202, 350, 2233, 219, 4, 8, 1437, 24, 1682, 9255, 98, 5, 760, 19008, 9, 5, 6399, 74, 3068, 62, 88, 127, 5397, 4, 24, 1415, 101, 10, 14072, 15, 162, 4, 13, 5135, 12, 939, 524, 195, 108, 176, 113, 1437, 12730, 29882, 734, 5632, 10, 650, 5120, 4, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]	"I really wanted to love this shirt! the colors are gorgeous  very vibrant and just as shown. the fit was all wrong on me. i ordered the petite xxs and it was still too boxy. and  it kept shifting so the front collar of the shirt would ride up into my neck. it looked like a sack on me. for reference- i am 5'2""  112lbs...with a small frame."	2023-06-11T06:26:11Z
    1209	1	2	[0, 100, 2638, 5, 3195, 8, 5, 2496, 9, 5, 21764, 4, 1437, 24, 21, 10, 828, 350, 765, 15, 162, 8, 939, 802, 24, 156, 162, 356, 2233, 219, 98, 939, 399, 75, 253, 62, 2396, 24, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]	I loved the color and the style of the sleeves.  it was a bit too short on me and i thought it made me look boxy so i didn't end up keeping it	2023-06-11T06:26:11Z
    17209	-1	0	[0, 133, 2564, 9, 5, 299, 16, 1528, 7, 1836, 1437, 53, 939, 269, 218, 75, 101, 5, 326, 1180, 2379, 8470, 1506, 41262, 12, 3341, 22861, 28517, 223, 5, 1104, 22990, 4, 5, 1104, 22990, 16, 4520, 1104, 8, 1302, 182, 28685, 1437, 53, 24, 817, 5, 22861, 28517, 12213, 356, 182, 11216, 8, 182, 28840, 326, 1180, 2379, 4, 24, 16, 6587, 11153, 561, 4, 939, 67, 399, 75, 101, 5, 619, 9, 5, 8470, 1506, 41262, 12, 3341, 10199, 136, 127, 3024, 4, 190, 600, 42, 16, 10, 205, 1318, 2125, 19, 10, 319, 9, 2679, 4617, 1437, 939, 437, 3668, 3981, 24, 124, 4, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]	The fit of the top is true to size  but i really don't like the taupe terrycloth-like sweatshirt under the white lace. the white lace is bright white and seems very sturdy  but it makes the sweatshirt underneath look very dirty and very noticeably taupe. it is terrible paired together. i also didn't like the feel of the terrycloth-like fabric against my skin. even though this is a good quality piece with a lot of interesting detail  i'm absolutely sending it back.	2023-06-11T06:26:11Z
    14582	-1	0	[0, 100, 269, 770, 7, 657, 42, 1437, 53, 24, 21, 95, 350, 13103, 18140, 1827, 7, 28, 34203, 4, 939, 524, 3700, 10, 1836, 158, 50, 316, 11, 14442, 8, 13855, 27734, 1437, 8, 5, 4761, 21, 1087, 6932, 198, 162, 4, 67, 5, 33827, 13977, 478, 162, 614, 8, 15713, 3804, 11, 41, 29747, 24203, 169, 4, 24, 56, 7, 213, 124, 4, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]	I really wanted to love this  but it was just too voluminous to be flattering. i am typically a size 10 or 12 in dresses and jumpsuits  and the medium was billowing around me. also the elastic waist hit me low and bunched in an unflattering way. it had to go back.	2023-06-11T06:26:11Z


<a name='c2w1-3.'></a>
# 3. Query the Feature Store
In addition to transforming the data and saving in S3 bucket, the processing job populates the feature store with the transformed and balanced data.  Let's query this data using Amazon Athena.

<a name='c2w1-3.1.'></a>
### 3.1. Export training, validation, and test datasets from the Feature Store

Here you will do the export only for the training dataset, as an example. 

Use `athena_query()` function to create an Athena query for the defined above Feature Group. Then you can pull the table name of the Amazon Glue Data Catalog table which is auto-generated by Feature Store.


```python
feature_store_query = feature_group.athena_query()

feature_store_table = feature_store_query.table_name

query_string = """
    SELECT date,
        review_id,
        sentiment, 
        label_id,
        input_ids,
        review_body
    FROM "{}" 
    WHERE split_type='train' 
    LIMIT 5
""".format(feature_store_table)

print('Glue Catalog table name: {}'.format(feature_store_table))
print('Running query: {}'.format(query_string))
```

    Glue Catalog table name: reviews_feature_group_1686463816_1686464741
    Running query: 
        SELECT date,
            review_id,
            sentiment, 
            label_id,
            input_ids,
            review_body
        FROM "reviews_feature_group_1686463816_1686464741" 
        WHERE split_type='train' 
        LIMIT 5
    


Configure the S3 location for the query results.  This allows us to re-use the query results for future queries if the data has not changed.  We can even share this S3 location between team members to improve query performance for common queries on data that does not change often.


```python
output_s3_uri = 's3://{}/query_results/{}/'.format(bucket, feature_store_offline_prefix)
print(output_s3_uri)
```

    s3://sagemaker-us-east-1-047418094836/query_results/reviews-feature-store-1686463816/


<a name='c2w1-ex-4'></a>
### Exercise 4

Query the feature store.

**Instructions**: Use `feature_store_query.run` function passing the constructed above query string and the location of the output S3 bucket.

```python
feature_store_query.run(
    query_string=..., # query string
    output_location=... # location of the output S3 bucket
)
```


```python
feature_store_query.run(
    ### BEGIN SOLUTION - DO NOT delete this comment for grading purposes
    query_string=query_string, # Replace None
    output_location=output_s3_uri # Replace None
    ### END SOLUTION - DO NOT delete this comment for grading purposes
)

feature_store_query.wait()
```


```python
import pandas as pd
pd.set_option("max_colwidth", 100)

df_feature_store = feature_store_query.as_dataframe()
df_feature_store
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>date</th>
      <th>review_id</th>
      <th>sentiment</th>
      <th>label_id</th>
      <th>input_ids</th>
      <th>review_body</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>2023-06-11T06:26:11Z</td>
      <td>18569</td>
      <td>1</td>
      <td>2</td>
      <td>[0, 16587, 1437, 657, 42, 299, 4, 10199, 16, 2579, 8, 3793, 1437, 1326, 372, 19, 2084, 6149, 103...</td>
      <td>Love  love this top. fabric is nice and soft  looks great with leggings. love the way it falls i...</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2023-06-11T06:26:11Z</td>
      <td>11103</td>
      <td>0</td>
      <td>1</td>
      <td>[0, 713, 16, 10, 7992, 23204, 4, 24, 16, 1256, 1437, 53, 34, 10, 765, 5933, 4, 2, 1, 1, 1, 1, 1,...</td>
      <td>This is a thick sweater. it is pretty  but has a short length.</td>
    </tr>
    <tr>
      <th>2</th>
      <td>2023-06-11T06:26:11Z</td>
      <td>1038</td>
      <td>-1</td>
      <td>0</td>
      <td>[0, 20328, 282, 75, 173, 15, 42, 5350, 11454, 22101, 4, 1437, 39328, 62, 74, 33, 1147, 19, 5, 61...</td>
      <td>Didn't work on this curvy gal.  sizing up would have helped with the button gaps  but the flowy ...</td>
    </tr>
    <tr>
      <th>3</th>
      <td>2023-06-11T06:26:11Z</td>
      <td>7946</td>
      <td>0</td>
      <td>1</td>
      <td>[0, 28965, 1437, 10, 269, 2579, 299, 14, 16, 3793, 8, 3473, 4, 5, 3124, 5933, 2323, 15481, 15, 5...</td>
      <td>Overall  a really nice top that is soft and comfortable. the arm length hits nicely on the forea...</td>
    </tr>
    <tr>
      <th>4</th>
      <td>2023-06-11T06:26:11Z</td>
      <td>3267</td>
      <td>-1</td>
      <td>0</td>
      <td>[0, 100, 269, 6640, 42, 6399, 5, 65, 86, 939, 300, 7, 3568, 24, 734, 4297, 77, 939, 15158, 24, 1...</td>
      <td>I really liked this shirt the one time i got to wear it...but when i washed it  according to the...</td>
    </tr>
  </tbody>
</table>
</div>



Review the Feature Store in SageMaker Studio

![](images/sm_studio_extensions_featurestore.png)

<a name='c2w1-3.2.'></a>
### 3.2. Export TSV from Feature Store

Save the output as a TSV file:


```python
df_feature_store.to_csv('./feature_store_export.tsv',
                        sep='\t',
                        index=False,
                        header=True)
```


```python
!head -n 5 ./feature_store_export.tsv
```

    date	review_id	sentiment	label_id	input_ids	review_body
    2023-06-11T06:26:11Z	18569	1	2	[0, 16587, 1437, 657, 42, 299, 4, 10199, 16, 2579, 8, 3793, 1437, 1326, 372, 19, 2084, 6149, 1033, 4, 657, 5, 169, 24, 5712, 11, 5, 760, 41, 251, 615, 11, 5, 124, 4, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]	Love  love this top. fabric is nice and soft  looks great with leggings. love the way it falls in the front an long enough in the back.
    2023-06-11T06:26:11Z	11103	0	1	[0, 713, 16, 10, 7992, 23204, 4, 24, 16, 1256, 1437, 53, 34, 10, 765, 5933, 4, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]	This is a thick sweater. it is pretty  but has a short length.
    2023-06-11T06:26:11Z	1038	-1	0	[0, 20328, 282, 75, 173, 15, 42, 5350, 11454, 22101, 4, 1437, 39328, 62, 74, 33, 1147, 19, 5, 6148, 10778, 1437, 53, 5, 3041, 219, 3989, 9, 5, 3089, 11556, 74, 33, 1415, 350, 21592, 15, 10, 2514, 1836, 4, 1437, 538, 1323, 4, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]	Didn't work on this curvy gal.  sizing up would have helped with the button gaps  but the flowy shape of the blouse would have looked too maternity on a larger size.  major pass.
    2023-06-11T06:26:11Z	7946	0	1	[0, 28965, 1437, 10, 269, 2579, 299, 14, 16, 3793, 8, 3473, 4, 5, 3124, 5933, 2323, 15481, 15, 5, 30357, 8, 5, 29815, 4617, 23, 299, 16, 157, 12, 3865, 28354, 4, 399, 75, 489, 42, 187, 5, 299, 156, 162, 356, 1341, 380, 11, 127, 11044, 1437, 7, 5, 477, 9, 45, 145, 34203, 4, 299, 16, 67, 10, 828, 2233, 219, 1437, 98, 939, 1017, 1095, 409, 114, 47, 32, 4716, 1459, 1437, 19, 10, 2514, 11044, 3867, 47, 32, 8578, 19, 14, 9723, 4, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]	Overall  a really nice top that is soft and comfortable. the arm length hits nicely on the forearm and the decorative detail at top is well-constructed. didn't keep this since the top made me look quite big in my bust  to the point of not being flattering. top is also a bit boxy  so i'd stay away if you are petite  with a larger bust unless you are okay with that emphasis.


Upload TSV to the S3 bucket:


```python
!aws s3 cp ./feature_store_export.tsv s3://$bucket/feature_store/feature_store_export.tsv
```

    upload: ./feature_store_export.tsv to s3://sagemaker-us-east-1-047418094836/feature_store/feature_store_export.tsv


Check the file in the S3 bucket:


```python
!aws s3 ls --recursive s3://$bucket/feature_store/feature_store_export.tsv
```

    2023-06-11 06:37:31       3622 feature_store/feature_store_export.tsv


<a name='c2w1-3.3.'></a>
### 3.3. Check that the dataset in the Feature Store is balanced by sentiment

Now you can setup an Athena query to check that the stored dataset is balanced by the target class `sentiment`.

<a name='c2w1-ex-5'></a>
### Exercise 5

Write an SQL query to count the total number of the reviews per `sentiment` stored in the Feature Group.

**Instructions**: Pass the SQL statement of the form 

```sql
SELECT category_column, COUNT(*) AS new_column_name
FROM table_name
GROUP BY category_column
```

into the variable `query_string_count_by_sentiment`. Here you would need to use the column `sentiment` and give a name `count_reviews` to the new column with the counts.


```python
feature_store_query_2 = feature_group.athena_query()

# Replace all None
### BEGIN SOLUTION - DO NOT delete this comment for grading purposes
query_string_count_by_sentiment = """
SELECT sentiment, COUNT(*) AS count_reviews
FROM "{}"
GROUP BY sentiment
""".format(feature_store_table)
### END SOLUTION - DO NOT delete this comment for grading purposes
```

<a name='c2w1-ex-6'></a>
### Exercise 6

Query the feature store.

**Instructions**: Use `run` function of the Feature Store query, passing the new query string `query_string_count_by_sentiment`. The output S3 bucket will remain unchanged. You can follow the example above.


```python
feature_store_query_2.run(
    ### BEGIN SOLUTION - DO NOT delete this comment for grading purposes
    query_string=query_string_count_by_sentiment, # Replace None
    output_location=output_s3_uri # Replace None
    ### END SOLUTION - DO NOT delete this comment for grading purposes
)

feature_store_query_2.wait()

df_count_by_sentiment = feature_store_query_2.as_dataframe()
df_count_by_sentiment
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>sentiment</th>
      <th>count_reviews</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>-1</td>
      <td>2051</td>
    </tr>
    <tr>
      <th>1</th>
      <td>0</td>
      <td>2051</td>
    </tr>
    <tr>
      <th>2</th>
      <td>1</td>
      <td>2051</td>
    </tr>
  </tbody>
</table>
</div>



<a name='c2w1-ex-7'></a>
### Exercise 7

Visualize the result of the query in the bar plot, showing the count of the reviews by sentiment value.

**Instructions**: Pass the resulting data frame `df_count_by_sentiment` into the `barplot` function of the `seaborn` library.

```python
sns.barplot(
    data=..., 
    x='...', 
    y='...',
    color="blue"
)
```


```python
%matplotlib inline
import seaborn as sns

sns.barplot(
    ### BEGIN SOLUTION - DO NOT delete this comment for grading purposes
    data=df_count_by_sentiment, # Replace None
    x='sentiment', # Replace None
    y='count_reviews', # Replace None
    ### END SOLUTION - DO NOT delete this comment for grading purposes
    color="blue"
)
```




    <matplotlib.axes._subplots.AxesSubplot at 0x7f0ad1ecddd0>




    
![png](output_75_1.png)
    


Upload the notebook and `prepare_data.py` file into S3 bucket for grading purposes.

**Note**: you may need to save the file before the upload.


```python
!aws s3 cp ./C2_W1_Assignment.ipynb s3://$bucket/C2_W1_Assignment_Learner.ipynb
!aws s3 cp ./src/prepare_data.py s3://$bucket/src/C2_W1_prepare_data_Learner.py
```

Please go to the main lab window and click on `Submit` button (see the `Finish the lab` section of the instructions).


```python

```
