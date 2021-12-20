import pymysql
import dotenv
import os 

pymysql.install_as_MySQLdb()

dotenv.load_dotenv(
        os.path.join(os.path.dirname(__file__), '.env')
    )