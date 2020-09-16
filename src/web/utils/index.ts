/** 找注释 */
export const FindNotes = function(sqlstr: string) {
  const notes: number[] = [];
  let sql = "";
  sqlstr.split("\n").forEach((line, index) => {
    if (line.trim().startsWith("--")) {
      notes.push(index);
    } else {
      sql = `${sql} ${line}`;
    }
  });
  return { sql, notes };
};

/** fn后修正光标位置 ele, fn*/
export const FixPosition = function() {
  // const range = window.getSelection();
  // // const range = document.createRange()
  // const lastposition = range.getRangeAt(0).startOffset;
  // console.log(lastposition);
  // setTimeout(() => {
  //   fn();
  //   // range.selectNode(this.$refs.sql)
  //   // range.setStart(this.$refs.sql, lastposition)
  //   // range.collapse(true)
  //   // seltion.removeAllRanges();
  //   // seltion.addRange(range);
  //   // range.selectAllChildren(this.$refs.sql); //range 选择obj下所有子内容
  //   range.collapse(ele.childNodes[0], lastposition); //光标移至最
  // }, 10);
};
