/** 找注释 */
export const FindNotes = function(ele, notes_class) {
    let newtxt = '', notes = 0;
    ele.innerText.split('\n').forEach(line => {
      if (line.trim().startsWith('--')) {
        notes += 1;
        line = `<div class="${notes_class}">${line}</div>`
      } else line = `${line}\n`
      newtxt = `${newtxt}${line}`
    })
    if (ele.querySelectorAll(`.${notes_class}`).length == notes) return false;
    return newtxt;
}

/** fn后修正光标位置 */
export const FixPosition = function(ele, fn) {
    const range = window.getSelection()
    // const range = document.createRange()
    const lastposition = range.getRangeAt(0).startOffset
    console.log(lastposition)
    setTimeout(() => {
        fn();
        // range.selectNode(this.$refs.sql)
        // range.setStart(this.$refs.sql, lastposition)
        // range.collapse(true)
        // seltion.removeAllRanges();
        // seltion.addRange(range);
    
        // range.selectAllChildren(this.$refs.sql); //range 选择obj下所有子内容
        range.collapse(ele.childNodes[0], lastposition); //光标移至最
    }, 10)
}