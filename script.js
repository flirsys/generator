function hl(code) {
  html = code
    .replace(/\'(.+?)\'/gi, "<into>'$1'</into>")
    .replace(/\"(.+?)\"/gi, '<into>"$1"</into>')
    .replace(/{(.+?)}/gi, '<var>{$1}</var>')
    .replace(/\'@import:(.+?)\'/gi, '\'<imp>@import:</imp><bimp>$1</bimp>\'')
    .replace(/v: (.+?) = (.*)/gi,
    '<span style="color: #81c922">v</span><dte>:</dte> $1 <span style="color: #8103a1">=</span> $2')
    .replace(/f\.(.+?) edit :(.+?) (.+?) (.+?):/gi,
    '<nf><l>f</l></nf>.$1 <ot>edit</ot> <dte>:</dte><into>$2 <do>$3</do> $4</into><dte>:</dte>')
    .replace(/f\.(.+?) (.+?) :(.+?) (.+?) (.+?) do (.+?) else (.+?):/gi,
    '<nf><l>f</l></nf>.$1 <ot>$2</ot> <dte>:</dte><into>$3 $4 $5 <do>do</do> $6 <el>else</el> $7</into><dte>:</dte>');
  return html;
}



function update(text) {
  let r_e = document.querySelector("#highlighting-content");
  if(text[text.length-1] == "\n") {
    text += " ";
  }
  r_e.innerHTML = text.replace(new RegExp(">", "g"), "&#62;").replace(new RegExp("<", "g"), "&#60;");
  r_e.innerHTML = hl(r_e.innerHTML);
}

function sync_scroll(element) {
  let r_e = document.querySelector("#highlighting");
  r_e.scrollTop = element.scrollTop;
  r_e.scrollLeft = element.scrollLeft;
}

function check_tab(element, event) {
  let code = element.value;
  if(event.key == "Tab") {
    event.preventDefault();
    let before_tab = code.slice(0, element.selectionStart);
    let after_tab = code.slice(element.selectionEnd, element.value.length);
    let cursor_pos = element.selectionStart + 1;
    element.value = before_tab + "\t" + after_tab;
    element.selectionStart = cursor_pos;
    element.selectionEnd = cursor_pos;
    update(element.value);
  }
}