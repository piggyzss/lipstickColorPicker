import React, { PureComponent } from 'react'
import { connect } from 'umi'
import { Dispatch } from 'redux'
// import { Connect } from 'react-redux'

import {
  colorRgb,
  getWheelColorList,
  rgbToHsv,
  hslToRgb,
  encodeHue,
} from '@/utils/color'

import {
  colorArray
} from '@/type'

const radius = 200
const radius2 = 300

const colorList = (data) => data.map(item => {
  const { color } = item
  return colorRgb(color)
})

interface State {
  color: string;
  info: string;
}

const mapStateToProps = (state) => ({
  lipstickInfoList: state.brand.lipstickInfoList,
  selectBrand: state.brand.selectBrand,
})

export type SwatchesProps = {
  dispatch: Dispatch;
  width: number;
  height: number;
} & ReturnType<typeof mapStateToProps>

class Swatches extends PureComponent<SwatchesProps, State> {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private canvasRef: React.RefObject<HTMLDivElement>
  private wheelColorList: Array<colorArray>
  private center: Array<number>
  private radiusMax: number
  private radiusMin: number
  private centerPoint: {
    centerX: number;
    centerY: number;
  }
  // 在初始化阶段注册 ref 回调函数去获得 DOM 的实例
  constructor (props: SwatchesProps) {
    super(props)
    this.canvasRef = ref => this.canvas = ref
    this.wheelColorList = getWheelColorList()
    this.center = [300,300]
    this.radiusMax = 220
    this.radiusMin = 200;
    this.centerPoint = {
      centerX: 0,
      centerY: 0,
    }
    this.state = {
      color: '#fff',
      info: '',
    }
  }

  componentDidMount () {
    // this.initEvent()
    this.drawColorWheel()
  }
  
  drawColorWheel(){
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D
    const [pointX, pointY] = this.center
    const wheelColorCount = this.wheelColorList.length
    const angel = (360/wheelColorCount)
    let rotate = 0
    
    //冷暖环
    const gradient = this.ctx.createLinearGradient(0, 0, radius2, 0)
    // 暖肤色
    gradient.addColorStop(0, "#FFDEAD")
    // 冷肤色
    gradient.addColorStop(1, "#FFEFD5")
    this.ctx.fillStyle = gradient
    this.ctx.beginPath()
    this.ctx.arc(pointX, pointY, this.radiusMax+60, 0, 2*Math.PI)
    this.ctx.closePath()
    this.ctx.fill()
    
    //色轮
    for (let p=0; p < wheelColorCount; p++){
      this.drawSector(pointX, pointY, radius, rotate, angel, this.wheelColorList[p])
      rotate += angel
    }

    //操作环
    // this.ctx.beginPath()
    // this.ctx.arc(pointX, pointY, this.radiusMin, 0, 2*Math.PI)
    // this.ctx.closePath()
    // this.ctx.fill()

    const { width, height, lipstickInfoList, selectBrand } = this.props
    const { data } = this.ctx.getImageData(0, 0, width, height)
    // 绘制找到的颜色
    for(var i = 0; i < data.length; i+=4){
      if (data[i] === 0 && data[i+1] === 0 && data[i+2] === 0 && data[i+3] === 0) {
        continue
      }
      // const colorData = [data[i], data[i+1], data[i+2], data[i+3]]
      const colorData=`rgb(${data[i]},${data[i+1]},${data[i+2]})`;

      if (colorList(lipstickInfoList[selectBrand]).includes(colorData)) {
        const index = i / 4
        const x = index % width    
        const y = index / width      
        this.ctx.beginPath()
        this.ctx.arc(x, y, 5, 0*Math.PI, 2*Math.PI)
        this.ctx.strokeStyle = 'rgba(255, 255, 255, .8)'
        this.ctx.stroke()
        this.ctx.closePath()
      }
    }
  }

  // 绘制扇形
  drawSector = (x: number, y: number, radius: number, sDeg: number, eDeg: number, colorArr: Array<number>) => {
    const [r, g, b] = colorArr
    const color=`rgb(${r},${g},${b})`

    //定义绘制扇形的方法
    const DEG = Math.PI / 180
    var grad = this.ctx.createRadialGradient(x, y, 1, x, y, radius) //定义一个渐变色
    grad.addColorStop(0, 'rgba(255,255,255,1)') //从白色圆心处渐变出来
    grad.addColorStop(0.5, color); //渐变出传入颜色
    // const d = 49/50 84 90 91 94/95 106 118
    const d = 90
    grad.addColorStop(1, `rgba(${d}, ${d}, ${d}, 1)`) //渐变出传入颜色
    this.ctx.beginPath()
    this.ctx.moveTo(x, y)
    this.ctx.arc(x, y, radius, DEG * sDeg, DEG * eDeg, false) //画圆同方法、控制起始角度就变成扇形
    this.ctx.fillStyle = grad //对扇形颜色设置
    this.ctx.fill() //填充
    this.ctx.closePath()
  }

  setColorPicker = (clientX: number, clientY: number) => {
    this.calculateCenterPoint({ clientX, clientY })
    this.setState({
      color: this.getColor()
    })
  }

  // 鼠标移动获取颜色
  handleMouseMove = (e: React.MouseEvent) => {
    this.setColorPicker(e.clientX, e.clientY)
  }
  
  calculateCenterPoint = ({ clientX, clientY }: {clientX: number; clientY: number}) => {
    const { left, top } = this.canvas.getBoundingClientRect()
    this.centerPoint = {
      centerX: Math.floor(clientX - left),
      centerY: Math.floor(clientY - top)
    }
  }

  getColor = () => {
    const { centerX, centerY } = this.centerPoint
    const { data } = this.ctx.getImageData(centerX, centerY, 1, 1)
    const color = transform2rgba(data)
    return color
  }

  render () {
    const { width, height } = this.props
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'row'
      }}>
        <div style={{ width:`${width}px`, height:`${height}px`, position: 'relative',}}>
          <canvas
            width={width}
            height={height}
            style={{ width, height }}
            ref={this.canvasRef}
            onMouseMove={this.handleMouseMove}
          />
          <div style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: 60,
            height: 30,
            border: '1px solid rgb(193, 1, 40)',
            background: `${this.state.color}`,
            borderRadius: 4,
          }}>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Swatches)
