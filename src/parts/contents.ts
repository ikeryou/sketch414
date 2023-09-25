import { Func } from "../core/func";
import { MyDisplay } from "../core/myDisplay";
import { Tween } from "../core/tween";
import { Point } from "../libs/point";
import { Item } from "./item";

// -----------------------------------------
//
// -----------------------------------------
export class Contents extends MyDisplay {

  private _item: Array<Item> = []

  constructor(opt:any) {
    super(opt)

    const num = 1
    for(let i = 0; i < num; i++) {
      const el = document.createElement('div')
      el.classList.add('js-item')
      this.el.append(el)

      this._item.push(new Item({
        el: el,
        id: i
      }))
    }

    this._resize()
  }

  protected _update(): void {
    super._update();

    const sw = Func.sw()
    const sh = Func.sh()

    const area = sw * Func.val(0.45, 0.3)
    const itemSize = (area / this._item.length) * 1
    const center = new Point(sw * 0.5, sh * 0.4 + Math.sin(this._c * 0.04) * itemSize * 0.05)

    this._item.forEach((item) => {
      item.setEmojiSize(itemSize)
      const itemX = sw * 0.5 - item.size.width * 0.5
      const itemY = center.y - item.size.height * 0.5
      Tween.set(item.el, {
        x: itemX,
        y: itemY,
        width: item.size.width,
        height: item.size.height,
        // rotationX: Math.sin(this._c * 0.04 + i * -0.1) * 5,
        // rotationY: Math.sin(this._c * 0.034 + i * 0.1) * 50,
        rotationZ: -45
      })

      item.effecVal = 0
    })
  }
}