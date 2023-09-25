import { MyDisplay } from "../core/myDisplay";
import { Tween } from "../core/tween";
import { Rect } from "../libs/rect";
import { Util } from "../libs/util";
import { Func } from "../core/func";

// -----------------------------------------
//
// -----------------------------------------
export class Item extends MyDisplay {

  private _emoji: HTMLElement
  private _eyeWrapper: HTMLElement
  private _eye: Array<HTMLElement> = []
  private _eyeEffect: Array<{ang:number, speed:number}> = []
  private _row: number = 1
  private _col: number = 30

  public effecVal: number = 0

  private _size: Rect = new Rect(0, 0, 0, 0)
  public get size(): Rect { return this._size }

  constructor(opt:any) {
    super(opt)

    this._emoji = document.createElement('div')
    this._emoji.classList.add('js-emoji')
    this.el.append(this._emoji)
    // this._emoji.innerHTML = ['😀', '😁', '🙂', '😊'][opt.id]
    this._emoji.innerHTML = '🍺'

    this._eyeWrapper = document.createElement('div')
    this._eyeWrapper.classList.add('js-mekakushi')
    this.el.append(this._eyeWrapper)

    // const col = new Color(Util.random(0,1), Util.random(0,1), Util.random(0,1))
    // Tween.set(this._emoji, {
    //   color: Util.hit(5) ? col.getStyle() : ''
    // })

    const num = this._col * this._row
    for(let i = 0; i < num; i++) {
      const eye = document.createElement('div')
      eye.classList.add('js-eye')
      this._eyeWrapper.append(eye)
      this._eye.push(eye)

      // const color = new Color(0,0,1)
      // Tween.set(eye, {
      //   border: Util.hit(5) ? `1px solid ${color.getStyle()}` : '',
      //   // backgroundColor: `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, 0.2)`,
      //   // display: !Util.hit(10) ? '' : 'none'
      // })

      // this._eyeEffect.push({
      //   ang: Util.randomInt(0, 360),
      //   speed: Util.random2(1, 3) * 5
      // })
      this._eyeEffect.push({
        ang: Util.map(i, 0, 360, 0, this._col - 1),
        speed: 10
      })

      this.useGPU(eye)
    }

    this.useGPU(this._emoji)
    this.useGPU(this.el)
  }

  public setEmojiSize(size: number):void {
    this._emoji.style.fontSize = `${size * 1}px`
  }


  protected _update():void {
    super._update();

    if(this._c % 1 == 0) {
      const emojiSize = new Rect(0, 0, this.getWidth(this._emoji), this.getHeight(this._emoji))
      this._size.copy(emojiSize)

      const meWidth = emojiSize.width * 1.5
      const meHeight = emojiSize.height * 1.5
      Tween.set(this._eyeWrapper, {
        width: meWidth,
        height: meHeight,
        x: emojiSize.width * 0.5 - meWidth * 0.5,
        y: emojiSize.height * 0.5 - meHeight * 0.5,
        // scaleY: Util.map(Math.sin(rad), 0, 1, -1, 1)
      })

      Tween.set(this._emoji, {
        rotationZ: 45,
      })

      const line = this._col
      this._eye.forEach((eye, i) => {
        const eyeX = i % line
        const eyeY = Math.floor(i / line)
        const eyeWidth = (meWidth / line)
        const eyeHeight = meHeight / this._row
        const effect = this._eyeEffect[i]
        const b = Math.max(0, Util.map(Math.sin(Util.radian(effect.ang)), 0, Func.val(20, 100), -1, 1) * (1 - this.effecVal))
        effect.ang += effect.speed
        Tween.set(eye, {
          width: eyeWidth + 1,
          height: eyeHeight,
          x: eyeX * eyeWidth,
          y: eyeY * eyeHeight,
          'backdrop-filter': `blur(${b}px)`,
        })

        if(Util.isSafari()) {
          Tween.set(eye, {
            '-webkit-backdrop-filter': `blur(${b}px)`,
          })
        }
      })
    }
  }
}