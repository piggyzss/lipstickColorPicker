import {
  colorArray
} from '@/type'

// hex -> rgb
export const colorRgb = (hexColor: string): string => {
  var sColor = hexColor.toLowerCase()
  //十六进制颜色值的正则表达式
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  // 如果是16进制颜色
  if (sColor && reg.test(sColor)) {
      if (sColor.length === 4) {
          var sColorNew = "#"
          for (var i=1; i<4; i+=1) {
              sColorNew += sColor.slice(i, i+1).concat(sColor.slice(i, i+1)) 
          }
          sColor = sColorNew
      }
      //处理六位的颜色值
      var sColorChange = []
      for (var i=1; i<7; i+=2) {
          sColorChange.push(parseInt("0x"+sColor.slice(i, i+2)))
      }
      return "rgb(" + sColorChange.join(",") + ")"
  }
  return sColor
}

// rgb -> hex
export const colorHex = (rgb: string): string => {
  var that = rgb
  //十六进制颜色值的正则表达式
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 如果是rgb颜色表示
  if (/^(rgb|RGB)/.test(that)) {
      var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",")
      var strHex = "#"
      for (var i=0; i<aColor.length; i++) {
          var hex = Number(aColor[i]).toString(16);
          if (hex.length < 2) {
              hex = '0' + hex 
          }
          strHex += hex
      }
      if (strHex.length !== 7) {
          strHex = that 
      }
      return strHex;
  } else if (reg.test(that)) {
      var aNum = that.replace(/#/,"").split("");
      if (aNum.length === 6) {
          return that  
      } else if(aNum.length === 3) {
          var numHex = "#"
          for (var i=0; i<aNum.length; i+=1) {
              numHex += (aNum[i] + aNum[i])
          }
          return numHex
      }
  }
  return that
}

// rgb -> hsl
const rgbToHsl = (rgb: Array<number>): Array<number> => {
  let [r, g, b] = rgb
  r /= 255, g /= 255, b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max == min){ 
    h = s = 0
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch(max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return [h, s, l]
}

// hsl -> rgb
/**
 * HSL颜色值转换为RGB
 * h, s, l 设定在 [0, 1] 之间
 * 返回的 r, g, b 在 [0, 255]之间
 * @param   Array    
 * @param   [h, s, l]  [色相, 饱和度, 亮度]
 * @return  Array  RGB色值数值 [r, g, b]
 */
export const hslToRgb = (hsl: Array<number>): Array<number> => {
  let [h, s, l] = hsl
  var r, g, b;

  if(s == 0) {
      r = g = b = l; // achromatic
  } else {
      var hue2rgb = function hue2rgb(p, q, t) {
          if(t < 0) t += 1;
          if(t > 1) t -= 1;
          if(t < 1/6) return p + (q - p) * 6 * t;
          if(t < 1/2) return q;
          if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
      }

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q
      h = h/360
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3)
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// hsv -> rgb
// 色相、饱和度、明度
const hsvToRgb = (hsv: Array<number>): Array<number> => {
  let [h, s, v] = hsv
  s = s / 100
  v = v / 100
  var r = 0, g = 0, b = 0
  var i = parseInt((h / 60) % 6)
  var f = h / 60 - i
  var p = v * (1 - s)
  var q = v * (1 - f * s)
  var t = v * (1 - (1 - f) * s)
  switch (i) {
    case 0:
      r = v
      g = t
      b = p
      break
    case 1:
      r = q
      g = v
      b = p
      break
    case 2:
      r = p
      g = v
      b = t
      break
    case 3:
      r = p
      g = q
      b = v
      break
    case 4:
      r = t
      g = p
      b = v
      break
    case 5:
      r = v
      g = p
      b = q
      break
    default:
      break
  }
  r = parseInt(r * 255)
  g = parseInt(g * 255)
  b = parseInt(b * 255)
  console.log('shanshan rgb', r, g, b)
  return [r, g, b]
}

// rgb -> hsv
export const rgbToHsv = (rgb: Array<number>): Array<number> =>  {
  let [r, g, b] = rgb
  r = r / 255
  g = g / 255
  b = b / 255
  let h, s, v
  const min = Math.min(r, g, b)
  const max = v = Math.max(r, g, b)
  const l = (min + max) / 2
  const difference = max - min

  if (max == min) {
    h = 0
  } else {
    switch (max) {
    case r:
      h = (g - b) / difference + (g < b ? 6 : 0)
      break
    case g:
      h = 2.0 + (b - r) / difference
      break
    case b:
      h = 4.0 + (r - g) / difference
      break
    }
    h = Math.round(h * 60)
  }
  if (max == 0) {
    s = 0
  } else {
    s = 1 - min / max
  }
  s = Math.round(s * 100)
  v = Math.round(v * 100)
  return [h, s, v]
}


export const getWheelColorList = (): Array<colorArray> => {
  let wheelColorList: Array<colorArray> = []
  for (let a = 230; a < 255; a++){
    // 紫色-粉色 (220,0,255)-(255,0,255)
    wheelColorList.push([a, 0, 255]);
  }
  for (let b = 255; b > 0; b--){
    // 粉色-红色 (255, 0, 255)-(255, 0, 0)
    wheelColorList.push([255, 0, b]);
  }
  for (let c = 0; c < 100; c++){
    // 红色-橙色 (255, 0, 0)-(255,100,0)
    wheelColorList.push([255, c, 0]);
  }
  return wheelColorList
}

export const transform2rgba = (arr) => {
  arr[3] = arr[3] === 0 ? 0 : parseFloat(arr[3] / 255)
  return `rgba(${arr.join(', ')})`
}