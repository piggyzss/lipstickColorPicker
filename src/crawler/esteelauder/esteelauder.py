# coding:utf-8

# 引入相关模块
import requests
# requests用于HTTP请求
from bs4 import BeautifulSoup
# BeautifulSoup用于解析HTML响应

import json

url = "https://www.esteelauder.com.cn/product/649/29657/product-catalog/envy-rouge"
json_filename = './esteelauder.json'

# 请求官网的URL，获取其页面内容
wbdata = requests.get(url).text
# 对获取到的文本进行解析
# 可以使用Python自带的html.parser，也可以选择使用lxml库
soup = BeautifulSoup(wbdata,'html.parser')
# 从解析文件中通过select选择器定位指定的元素，返回一个列表
# select 的功能跟find和find_all 一样用来选取特定的标签，它的选取规则依赖于css
# 支持通过标签名/类名/id/属性等查找
lips_titles = soup.select("a.swatch")
lips_color = soup.select(".swatch__container .swatch--1 ")

# 对返回的列表进行遍历
result = []
for index, val in enumerate(lips_titles):
    # 提取内容和颜色信息
    # title = val.get_text()
    name = val.get("name")
    color = lips_color[index].get('style').split(':')[1].split(';')[0]
    
    data = {
        # '标题':title,
        u'info': name,
        u'color': color,
    }
    result.append(data)
    print('data', data)

with open(json_filename, 'w') as f:
    json.dump({'esteelauder': result}, f)


