import styled from '@emotion/styled'

export const SwatchesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  padding: 20px;
`

export const CanvasWrapper = styled.div<{width: number, height: number}>`
  height: ${props => props.height};
  width: ${props => props.width};
  cursor: pointer;
`

export const SkinColorWrapper = styled.div<{skinColor: string}>`
  position: relative;
  width: 300px;
  height: 100px;
  background: ${props => props.skinColor};
  border-radius: 2px;
`

export const ColorPickerWrapper = styled.div<{color: string}>`
  position: absolute;
  width: 60;
  height: 30;
  background: ${props => props.color};
  border-radius: 2px;
`