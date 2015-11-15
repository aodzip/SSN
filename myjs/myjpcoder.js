function Jpcoder(flag,start,end){
    this.flag = flag;
    this.start = start;
    this.end = end;
    this.patt = new RegExp(""+start+"((.|\n)*?)"+end+"");
}
Jpcoder.prototype._encodeUnicode = function(str,flag){
    var result = "";
    for(var i=0;i<str.length;i++){
        var unicode = str.charCodeAt(i).toString(16);
        if(i==0){
            result = result +unicode;
        }else{
            result = result + flag + unicode;
        }
    }
    return result;
}
Jpcoder.prototype._decodeUnicode = function(str,flag){
    var array = str.split(flag);
    var result = "";
    for(i in array){
        var item = array[i];
        result = result + String.fromCharCode(parseInt(item,16));
    }
    return result;
}

Jpcoder.prototype.getjp = function(str){
    var result = this.patt.exec(str);
    if(!result){
        return null;
    }
    var jpstr = result[0].replace(this.start,"").replace(this.end,"");
    return jpstr;
}

Jpcoder.prototype.encodejp = function(str){
    var jpstr = this.getjp(str);
    if(!jpstr){
        return str;
    }
    var encode = this._encodeUnicode(jpstr,this.flag);
    var output = str.replace(this.patt,this.start+encode+this.end);
    return output;
}
Jpcoder.prototype.decodejp = function(str){
    var jpstr = this.getjp(str);
    if(!jpstr){
        return str;
    }
    var encode = this._decodeUnicode(jpstr,this.flag);
    var output = str.replace(this.patt,this.start+encode+this.end);
    return output;
}
Jpcoder.prototype.hasjp = function(str){
    var patt = new RegExp("[\u2E80-\u9FFF]");
    return patt.test(str);
}