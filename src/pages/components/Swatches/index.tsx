import React, { PureComponent } from 'react'
import { connect } from 'umi'
import { Dispatch } from 'redux'
import { Slider } from 'antd'
import tinycolor from "tinycolor2"
import { transform2rgba } from '@/utils/color'
import { MinMax } from '@/type'

import { BrandState } from '@/models/brand'

import * as S from './styles'

const minMax: MinMax = {
  maxHue: 213.28205128205127,
  maxLight: 95.7843137254902,
  minHue: 164.5071770334928,
  minLight: 6.666666666666664,
}

const bgDpi = 0.2
const zrDpi = 1

interface State {
  color: string;
  skinColor: string;
  info: string;
}

const mapStateToProps = (state: {
  brand: BrandState;
}) => ({
  lipstickInfoList: state.brand.lipstickInfoList,
  selectBrand: state.brand.selectBrand,
  selectColor: state.brand.selectColor,
})

export type SwatchesProps = {
  width: number;
  height: number;
} & { dispatch: Dispatch } & ReturnType<typeof mapStateToProps>

class Swatches extends PureComponent<SwatchesProps, State> {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private canvasRef: React.RefObject<HTMLDivElement>
  private centerPoint: {
    centerX: number;
    centerY: number;
  }
  // 在初始化阶段注册 ref 回调函数去获得 DOM 的实例
  constructor (props: SwatchesProps) {
    super(props)
    this.canvasRef = ref => this.canvas = ref
    this.centerPoint = {
      centerX: 0,
      centerY: 0,
    }
    this.state = {
      color: '#FFDAC0',
      skinColor: '#FFDAC0',
      info: '',
    }
  }

  componentDidMount () {
    this.drawColorBackground()
    // this.drawColorPoint()
  }

  shouldComponentUpdate (nextProps: SwatchesProps) {
    if (this.props.selectColor !== nextProps.selectColor) {
      const { width, height } = this.props
      this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D
      this.ctx.clearRect(0, 0, width, height)
      this.drawColorBackground()
      this.drawColorPoint(nextProps.selectColor)
      this.setState({
        color: nextProps.selectColor,
      })
    }

    return true
  }

  encodeHue(hue: number) {
    if (hue < 180) {
      return 180 - hue
    }
    else {
      return 540 - hue
    }
  }
  
  drawColorBackground(){
    const { width, height } = this.props
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D
    const imgData = this.ctx.createImageData(width, height)
    let data = imgData.data

    for (let y = 0; y < height; ++y) {
      for (let x = 0; x < width; ++x) {
        const light = (height - y) / height * (minMax.maxLight - minMax.minLight) + minMax.minLight
        const hue = x / width * (minMax.maxHue - minMax.minHue) + minMax.minHue

        const color = tinycolor({
            h: this.encodeHue(hue),
            s: 80,
            l: light
        })
        const rgb = color.toRgb()
        const id = (y * width + x) * 4
        data[id] = rgb.r
        data[id + 1] = rgb.g
        data[id + 2] = rgb.b
        data[id + 3] = 255
      }
    }
    this.ctx.putImageData(imgData, 0, 0)
  }

  drawColorPoint = (color: string) => {
    const { width, height } = this.props
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D
    const hsl = tinycolor(tinycolor(color).toRgb()).toHsl()
    var hue = this.encodeHue(hsl.h)
    var light = hsl.l * 100

    const x = (hue - minMax.minHue) * width / (minMax.maxHue - minMax.minHue)
    const y = height - (light - minMax.minLight) * height / (minMax.maxLight - minMax.minLight)

    var pos = [x * zrDpi, y * zrDpi]

    this.ctx.beginPath()
    this.ctx.arc(pos[0], pos[1], 5, 0*Math.PI, 2*Math.PI)
    this.ctx.strokeStyle = 'rgba(255, 255, 255, .8)'
    this.ctx.stroke()
    this.ctx.closePath()
  }

  setColorPicker = (clientX: number, clientY: number) => {
    this.calculateCenterPoint({ clientX, clientY })
    this.setState({
      color: this.getColor()
    })
  }

  // 鼠标移动获取颜色
  handleMouseClick = (e: React.MouseEvent) => {
    this.setColorPicker(e.clientX, e.clientY)
  }

  //
  handleChangeSkinColor = (value: number) => {
    const hsl = tinycolor(tinycolor('#FFDAC0').toRgb()).toHsl()
    const aa = value - 50
    const color = tinycolor({
      h: hsl.h + aa * 0.02,
      s: hsl.s,
      l: hsl.l - aa * 0.001
    })
    this.setState({
      skinColor: color.toRgbString(),
    })
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
    const { width, height, selectColor } = this.props
    return (
      <S.SwatchesWrapper>
        <S.CanvasWrapper width={width} height={height}>
          <canvas
            width={width}
            height={height}
            style={{ width, height }}
            ref={this.canvasRef}
            onClick={this.handleMouseClick}
          />
        </S.CanvasWrapper>
        <S.SkinColorWrapper skinColor={this.state.skinColor}>
          {/* <S.ColorPickerWrapper color={this.state.color} /> */}
          <div style={{
            position: "absolute",
            width: 80,
            height: 40,
            top: 30,
            left: 110,
            background: `${this.state.color}`,
            borderRadius: 2,
          }}>
          </div>
        </S.SkinColorWrapper>
        <Slider defaultValue={50} tooltipVisible onChange={this.handleChangeSkinColor} />
      </S.SwatchesWrapper>
    )
  }
}

export default connect(mapStateToProps)(Swatches)

