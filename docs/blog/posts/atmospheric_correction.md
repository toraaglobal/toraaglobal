---
date: 2023-08-13
authors: [tabdulazeez]
description: >
    Unveiling the Power of Landsat Atmospheric Correction Using R
categories:
  - Remote Sensing 
---

# Unveiling the Power of Landsat Atmospheric Correction Using R
In the realm of remote sensing and geospatial analysis, Landsat imagery plays a pivotal role in understanding and monitoring Earth's surface. However, to extract accurate information from these images, it's crucial to apply proper atmospheric correction techniques. In this blog post, we'll dive into the process of atmospheric correction using the R programming language and the RStoolbox package. Best of all, this package is both free and open source, making it accessible to all.

<!-- more -->

## Getting Started with RStoolbox
RStoolbox is a R package providing a wide range of tools for your every-day remote sensing processing needs. The available toolset covers many aspects from data import, pre-processing, data analysis, image classification and graphical display. RStoolbox builds upon the raster package, which makes it suitable for processing large data-sets even on smaller workstations.

To embark on this journey, we'll harness the capabilities of the RStoolbox package. This versatile tool is designed to facilitate the atmospheric correction of Landsat imagery, ensuring that the data we work with is both accurate and reliable.

Let's delve into the step-by-step process of atmospheric correction using the RStoolbox package.

### Step 1: Installing RStoolbox
RStoolbox is now available from CRAN and can be installed as usual with

```R
install.packages("RStoolbox")
```

### Step 2: Reading Metadata
The first step involves reading the metadata associated with a Landsat image. The readMeta() function allows us to extract essential information from the metadata file. Let's take a peek at how this is done:

```R
# Read metadata for Landsat image
meta2011 = readMeta('LT05_L1TP_130045_20060424_20161122_01_T1_MTL.txt')
summary(meta2011)

```

### Step 3: Stacking Landsat Bands
After acquiring the metadata, it's time to stack individual Landsat bands together. This consolidated stack forms the foundation for subsequent calculations. Here's how it's done:

```R
# Stack individual Landsat bands
p22_2011 = stackMeta(meta2011)
dn2_rad = meta2011$CALRAD # Extract offset gain data

```

### Step 4: Conversion to Radiant Values
Now, we move on to converting the digital numbers (DN) to top-of-the-atmosphere radiance. This process is crucial for ensuring that the data accurately represents the radiance values received from the Earth's surface:

```R 
# Convert DN to radiance
p22_2011_rad = radCor(p22_2011, metaData = meta2011, method = 'rad')

```

### Step 5: Top of Atmosphere Reflectance
To obtain top-of-atmosphere (TOA) reflectance values, we proceed with additional atmospheric correction:

```R 
# Calculate TOA reflectance
p22_2011_ref = radCor(p22_2011, metaData = meta2011, method = 'apref')

```

### Step 6: Haze Correction
Haze can significantly impact the accuracy of remote sensing data. With the RStoolbox package, we can estimate and correct for haze:

```R
# Estimate and correct for haze
haze = estimateHaze(p22_2011, darkProp = 0.01, hazeBands = c("B1_dn", "B2_dn", "B3_dn", "B4_dn"))

```

### Step 7: Dark Object Extraction (DOS)
The Dark Object Subtraction (DOS) technique helps remove atmospheric effects caused by dark objects in the scene:

```R
# Apply Dark Object Subtraction (DOS)
p22_2011_dos = radCor(p22_2011, metaData = meta2011, darkProp = 0.01, method = 'dos')

```

### Step 8: Calculate NDVI
Finally, we can calculate the Normalized Difference Vegetation Index (NDVI) – a crucial metric for vegetation analysis – using the spectral indices function:

```R
# Calculate NDVI
ndvi = spectralIndices(p22_2011, red = "B3_dn", nir = 'B4_dn', indices = 'NDVI')
```


## Conclusion
And there you have it! By employing the RStoolbox package, we've journeyed through the intricate process of atmospheric correction for Landsat imagery. Each step contributes to transforming raw data into meaningful and accurate information, paving the way for a wide range of geospatial analyses and applications. The power of open source tools like RStoolbox empowers us to explore, analyze, and interpret our world with precision.


