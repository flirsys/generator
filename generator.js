class Codespace{
  inputcode = null;
  result = null;
  funcs = [];
  vars = [];

  init(){
    this.inputcode = document.getElementById('code');
    this.result = document.getElementById('result');
  }
  save(upd){
    this.result.innerHTML = this.reform(this.inputcode.value, upd);
  }

  reform(code, upd) {
    this.funcs.n = function() { return false; };
    let html = "";
    let lines = code.split(/\r\n|\r|\n/).length;
    if(upd == 0){
      this.funcs = [];
      this.vars = [];
    }
    for(let i=0; i<lines; i++){
      let line = code.split(/\n/)[i];
      if(line == '') continue;

      line.replace(/text\.(.+?).\'(.*)\'(.*)\'(.*)\'/gi, function(text, id, style, p, data){ //text.id.'styles..' 'text..'
        let styles = '';
        if(style != '') styles = style; else styles = "font-size: 20px";
        html += '<div id="'+id+'" style="'+styles+'">'+data+'</div>';
      });
      line.replace(/button\.(.+?).\'(.*)\'(.*)\'(.+?)\'(.*)\'(.+?)\'/gi, function(text, id, style, p1, data, p2, func){ //button.id '..'
        let styles = '';
        if(style != '') styles = style; else styles = "font-size: 20px; border-radius: 0px";
        html += '<button id="'+id+'" onclick="codespace.funcs.'+func+'();codespace.save(1);" style="'+styles+'">'+data+'</button>';
      });
      line.replace(/style\.(.+?) \'(.+?)\'/gi, function(text, id, data){ //style.id '..'
        document.getElementById(''+id+'').style = data;
      });
      
      line = line.replace(/\[(.+?)\]/gi, function(text) { return codespace.getVarOfStr(text); }); //{..}

      if(upd == 0) line.replace(/v: (.+?) = (.*)/gi, function(text, name, value){
        let vp = 'codespace.vars.'+name+' = '+value+'';
        eval(vp);
      });

      line.replace(/f\.(.+?) edit.(.+?) \{(.+?)\}/gi,
        function(text, func, name, what){
          let vp = 'codespace.funcs.'+func+' = function() { codespace.vars.'+name+' '+what+'; }';
          eval(vp); 
      });

      line.replace(/f\.(.+?) if \((.+?) (.+?) (.+?)\) do \{(.+?)\} else \{(.+?)\}/gi,
        function(text, func, arg1, logic, arg2, todo, elsedo){
          let yesdo = "";
          let yeselse = "";

          todo = todo.split(" ");
          for(let i = 0; i < todo.length; ++i){
            yesdo += " codespace.funcs."+todo[i]+"();"
          }
          
          elsedo = elsedo.split(" ");
          for(let i = 0; i < elsedo.length; ++i){
            yeselse += " codespace.funcs."+elsedo[i]+"();"
          }
          
          let vp = 'codespace.funcs.'+func+' = function(){ if('+arg1+' '+logic+' '+arg2+'){'+yesdo+'} else {'+yeselse+'} }';
          eval(vp); 
        }
      );  
    }
    html = html.replace(/\[(.+?)\]/gi, function(text) { return codespace.getVarOfStr(text); });
    return html;
  }

  getVarOfStr(text){
    let s_pos = text.indexOf('[') + 1;
    let e_pos = text.indexOf(']',s_pos);
    let vp = text.substring(s_pos,e_pos);
    return eval("codespace.vars."+vp);
  }
}
codespace = new Codespace();

function example() {
  document.getElementById('code').value = `v: num = 111
v: up = 1
v: toup = [up] * 10
  
f.add edit.num {+=[up]}
f.addup edit.up {+=1}
f.remnum edit.num {-=[toup]}
f.updatetoup edit.toup {=[up+1] *10}
  
f.logic if ([num] >= [toup]) do {addup remnum updatetoup} else {n}
  
text.io 'color:red;font-size:25px' '<center>score: [num]</center>'
text.io 'color:blue' '<center>up: [up]</center>'
text.io 'color:orange' '<center>price: [toup]</center><br>'
  
button.ia 'color:green;width:100%;font-size:20px' 'click' 'add'
button.ia 'color:green;width:100%;font-size:20px' 'up' 'logic'`;
}