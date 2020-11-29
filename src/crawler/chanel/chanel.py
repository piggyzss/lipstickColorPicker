# coding:utf-8

# 引入相关模块
import requests
from bs4 import BeautifulSoup
from PIL import Image
# PIL：Python Imaging Library，它为python提供了图像编辑功能

import json

url = "https://www.chanel.cn/zh_CN/fragrance-beauty/makeup/p/lips/lipsticks.html"
json_filename = './chanel.json'

wbdata = requests.get(url).text
soup = BeautifulSoup(wbdata,'html.parser')
lips_imgs = soup.select("button.fnb_shades-content img")

# lips_color = soup.select(".swatch__container .swatch--1 ")


result = []
# pic_id = 0  # 图片编号
# 把图片down到本地
# for index, val in enumerate(lips_imgs):
#     # 提取内容和颜色信息
#     # title = val.get_text()
#     imgUrl_src = val.get('src')
#     pic_file = open('./img/pic_'+str(pic_id)+'.jpg', 'wb')  # 二进制创建并写入文件
#     pic_file.write(requests.get('https://www.chanel.cn'+imgUrl_src).content)  # 写出请求得到的img资源
#     pic_id += 1

# result = []
# for index, val in enumerate(lips_imgs):
#     # 提取内容和颜色信息
#     # title = val.get_text()
#     info = val.get("alt")

#     imgUrl_src = './img/pic_'+str(index)+'.jpg'
#     img = Image.open(imgUrl_src, 'r').convert('RGB')
#     data = img.getcolors()
#     tem = data[len(data) / 2][1]
#     data = {
#         # '标题':title,
#         u'info': info,
#         u'color': 'rgb('+str(tem[0])+','+str(tem[1])+','+str(tem[2])+')',
#     }
#     result.append(data)

# for group in soup.select("div.fnb_product_grid_description a"):
#     # 提取内容和颜色信息
#     title = val.get_text()
#     # result.append(data)
#     print('data', title)

result = {}
pic_index = 0  # 图片编号
for group in soup.select('div.fnb_product-grid-infos'):
    print('kk', group.select('div.fnb_product_grid_description a'))
    title = group.select('div.fnb_product_grid_description a')[0].get_text()

    tem_result = []

    for image in group.parent.select('div.fnb_product-grid-shades button.fnb_shades-content img'):
        info = image.get("alt")

        imgUrl_src = './img/pic_'+str(pic_index)+'.jpg'
        img = Image.open(imgUrl_src, 'r').convert('RGB')
        data = img.getcolors()
        tem = data[len(data) / 2][1]
        data = {
            # '标题':title,
            u'info': info,
            u'color': 'rgb('+str(tem[0])+','+str(tem[1])+','+str(tem[2])+')',
        }
        tem_result.append(data)

        pic_index += 1

    result[title] = tem_result
print('result', result)

with open(json_filename, 'w') as f:
    json.dump({'chanel': result}, f)


