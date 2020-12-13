# coding:utf-8

# 引入相关模块
import requests
# requests用于HTTP请求
from bs4 import BeautifulSoup
# BeautifulSoup用于解析HTML响应

import json
json_filename = './esteelauder.json'

url = 'https://www.esteelauder.com.cn/products/649/product-catalog'
# 请求官网的URL，获取其页面内容
wbdata = requests.get(url).text
# 对获取到的文本进行解析
# 可以使用Python自带的html.parser，也可以选择使用lxml库
soup = BeautifulSoup(wbdata,'html.parser')
# 从解析文件中通过select选择器定位指定的元素，返回一个列表
# select 的功能跟find和find_all 一样用来选取特定的标签，它的选取规则依赖于css
# 支持通过标签名/类名/id/属性等查找
type_list = soup.select(".mpp__product-grid a.product_brief__image-container")

print('shanshan href', type_list)

result = {}

for index, val in enumerate(type_list):
    href = val.get("href")
    url = "https://www.esteelauder.com.cn"+ href
    wbdata = requests.get(url).text
    soup = BeautifulSoup(wbdata,'html.parser')
    lips_type = soup.select("div.product-full__description .product-full__subtitle")[0].get_text()
    lips_titles = soup.select("ul.js-shade-picker a.swatch")
    lips_color = soup.select("ul.js-shade-picker .swatch__container .swatch--1 ")

    result[lips_type] = []

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
        result[lips_type].append(data)
        print('data', data)

    
print('shanshan result', result)

with open(json_filename, 'w') as f:
    json.dump({'esteelauder': result}, f)


