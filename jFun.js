//author: Qiu
//email : 41918235@qq.com

function jFun(rs)	{this.rs = rs;}


(function(){
    var docc=document;

    Number.prototype.tofixed = function(n)
    {
        n = Math.pow(10, n);
        return Math.round(this*n) / n;
    }
    String.prototype.replaceAll = function(s1,s2){return this.replace(new RegExp(s1,"gm"),s2);};

    function ready(fn)  {window.onload = function(){fn(jFun.init)}}

    function isOdd(n)   {return (n & 1);}
    function isEven(n)  {return !isOdd(n);}

    function lower(s)   {return s.toLowerCase();}
    function upper(s)   {return s.toUpperCase();}

    function isEqu(a,b)     {return a===b;}
    function notEqu(a,b)    {return a!==b;}
    function isMore(a,b)    {return a>b}
    function isLess(a,b)    {return a<b}
    function retTrue()      {return true;}

    function shead(s)   {return s.charAt(0);}
    function sbody(s)   {return s.substr(1);}
    function stail(s)   {return s.slice(-1);}
    function cutNeck(s) {return {head:shead(s), body:sbody(s)};}
    function headUpper(s){return upper(shead(s))+lower(sbody(s));}

    function ltrim(s)   {return s.replace(/^\s+/,"");}
    function rtrim(s)   {return s.replace(/\s+$/,"");}
    function trim(s)    {return rtrim(ltrim(s));}



    var typeList={};
    function typeoff(obj)
    {//(NaN===NaN)===false ; isNaN(fn)===true
        if(obj===null || obj===undefined || (typeof obj==="number" && isNaN(obj))) 
            return String(obj);

        var i = {}.toString.call(obj);
        return typeList[i] = typeList[i] || lower(i.match(/[a-z]+/gi)[1]);
    }

    function isNum(e)   {return typeoff(e) === "number";}
    function isStr(e)   {return typeoff(e) === "string";}
    function isFn(e)    {return typeoff(e) === "function";}
    function isArr(e)   {return typeoff(e) === "array";} 
    function isObj(e)   {return typeoff(e) === "object";}

    function isWindow(e){return e===window;}
    function isArrLike(e){return e.length!==undefined && !isWindow(e);} 


    function indexOfSorted(arr,elem)
    {
        var i, begin = 0, end = arr.length-1 ;
        while(begin<=end)
        {
            i = Math.floor( (begin+end)/2 );
            if(elem<arr[i])
                end = i-1;		//elem before arr[i]
            else if(elem>arr[i])
                begin = i+1;	//elem after arr[i]
            else
                return i;
        }
        return -1;
    }

    function indexOf(arr,elem, sorted)
    {
        if(arr.indexOf)
            return arr.indexOf(elem);
        if(sorted)
            return indexOfSorted(arr,elem);

        if(isArrLike(arr))
        {
            for(var i=-1, len = +arr.length; ++i < len; )
                if(arr[i]===elem)
                    return i;
            return -1;	
        }
        else
        {
            for(var i in arr)
                if(arr[i]===elem)
                    return i;
            return undefined;
        }
    }

    function has(arr,e, sorted){ 
        var index = indexOf(arr,e, sorted);
        return typeof index==="number"? index>-1 : index;
    }

    function toArray(obj)
    {
        if(isArr(obj))	return obj;
        if(obj.toArray)	return obj.toArray();
        try {
            return Array.prototype.slice.call(obj,0)
        }
        catch(e)
        {
            var arr=[];
            for(var i=-1, len=obj.length; ++i<len; )
                arr.push(obj[i]);
            return arr;
        }
    }


    //function dftVal(a,b){return a===undefined ? b : a;}

    function typeAbb(s){
        return s==="function"? "fn" : ( s==="boolean"? "bool" : s.substr(0,3) );
    }
    function typeArgExcept(s)
    {
        s += " except";
        for(var i in this)
            if(!has(s, i) )
                return this[i];
    }
    function typeArg(args,begin,end)
    {
        var count = {}, obj = {except : typeArgExcept} ;
        begin = begin || 0;
        end = end || args.length;

        for(var t, i = begin-1; ++i < end; )
        {
            t = typeAbb( typeoff(args[i]) );
            (count[t]===undefined) ? (count[t]=0) : (count[t]++);
            obj[t + count[t]] = args[i];
        }
        return obj;
    }

    function swapObjAttr(obj1,s1,obj2,s2)
    {
        if(arguments.length <4)
            s2=obj2, obj2=obj1;

        var t=obj1[s1];
        obj1[s1]=obj2[s2];
        obj2[s2]=t;
    };

    function lastOf(arr)    {return arr[arr.length-1];}


    function each(arr, begin,end,directArr,fn)
    {
        var a = typeArg(arguments,1);
        begin = a.num0 || 0;	
        end =	a.num1 || arr.length;
        fn =	a.fn0;
        directArr = a.arr0 || a.obj0 || arr;
        
        var retVal;
        if( isArrLike(arr) ) 
        {//array like
            for(var i= begin-1; ++i<end; )
            {
                retVal = fn.call(arr[i],arr[i], i) ;
                if(retVal !== undefined)
                {
                    if(retVal===false) break;                
                    directArr[i] = retVal;
                }
            }
        }
        else
        {//object
            for( var i in arr)
            {
                retVal = fn.call(arr[i],arr[i], i) ;
                if(retVal !== undefined)
                {
                    if(retVal===false) break;                
                    directArr[i] = retVal;
                }
            }
        }
        return directArr;
    }


    function map(arr,begin,end,type,fn)	
    {
        type = type || ( isArrLike(arr) ? [] : {} );
        return each(arr,begin,end,type,fn); 
    }


    function existNamespace(obj)//str1,str2....
    {
        for(var i= 1-1, len = arguments.length; ++i < len; )
        {
            if(obj[arguments[i]]===undefined)
                return false;
            obj = obj[arguments[i]];
        }
        return obj;
    }

    function namespace(obj)//str1,str2....
    {
        each(arguments,1,function(name)
        {
            if(obj[name]===undefined)
                obj[name]={};
            obj=obj[name];
        });
        return obj;
    }
    function arrspace(obj)//str1,str2....
    {
        each(arguments,1,function(name)
        {
            if(obj[name]===undefined)
                obj[name]=[];
            obj=obj[name];
        });
    }


    function scrollExec(time,fnArr)
    {
        var i = 0, len = fnArr.length;
        function fn(){fnArr[ (i++)%len ]()}
        return setInterval(fn,time);
    }

    function concatOuter(obj,str)
    {
        var htSign = {	object:	{h:"{", t:"}"},
                        array:	{h:"[", t:"]"},
                        string:	{h:'"', t:'"'}};
        var type = typeoff(obj);
        return htSign[type].h + str + htSign[type].t;
    }

    function outputObj(obj,n)
    {
        var str = "",
    //		tabs = "",
            type = typeoff(obj);

    //	for(var i=0; i<n; i++)
    //		tabs += "	";

        if( has(["object","array"], type) )
        {
            var tmpArr = [],
                bool = (type==="object") ;

            str += ( (bool?"{":"["));
            each(obj, function(elem,i){
                tmpArr.push( (bool?('"'+i+'":'):"") + outputObj(elem,n+1) );
            });
            str += tmpArr.join("," )
            str += ((bool?"}":"]") + "\n");
        }
        else if(type==="string")
            str += ('"'+String(obj)+'"');
        else
            str += String(obj);
        
        return str;
    }

    function copyStr(str)
    {
        var TEXTAREA = document.createElement("TEXTAREA");
        TEXTAREA.value = str;
        TEXTAREA.select();
        TEXTAREA.createTextRange().execCommand("Copy");
    }


    function ajax(url,method,data,async,fn)
    {
        var a = typeArg(arguments);
        url = a.str0;
        method = a.str1 || "GET",
        data = a.str2 || "",
        async = a.bool0 || true,
        fn = a.fn0;
        
        var aj = new (window.XMLHttpRequest || ActiveXObject)("Microsoft.XMLHTTP");
        aj.onreadystatechange = function(){
            if(aj.readyState==4 && aj.status==200)
                fn({//json:	aj.responseJSON,
                    text:	aj.responseText, 
                    xml:	aj.responseXML});
        }

        aj.open(method, url, async);
        if(upper(method)==="GET")
            aj.send();
        else
        {
            aj.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            aj.send(data);
        }
    }


    function splitBy(s,reg) {return s.match(reg);}
    function splitBySpace(s){return splitBy(s,/[^\s\n]+/g);}
    function splitByEqu(s)  {return s.match(/\=|[^\s\=]+/g);}

    function splitBySemicolon(s)    {return s.split(";")}

    function isParenMatch(s)
    {
        var left = s.match(/\(/g) || [], 
            right= s.match(/\)/g) || [] ;
        return left.length===right.length;
    }

    function splitByComma(s)
    {
        var head=shead(s);
        s=sbody(s).split(",");
        for(var i=0; i<s.length; i++)
            if( ! isParenMatch(s[i]) )
            {
                if(s[i+1]===undefined) break;
                s[i] += (","+s[i+1]) ;
                s.splice(i+1,1);
                i--;
            }
        s[0] = head+s[0];
        return s;
    }

    if(!window.JSON)
    {
        window.JSON = {};
        window.JSON.stringify = outputObj;
        window.JSON.parse = function(str)
        {//not strict
            function notJSON(){alert("not JSON:  "+str);}
            try {return eval("("+str+")");}
            catch(e){notJSON()}
        }
    }


     




    function concatArr(arr, obj)    //modify arr unless ( arr===[] && isArr(obj) )
    {
        if( arr===[] && isArr(obj) )
            return obj;

        try { [].push.apply(arr,obj); }
        catch(e){
            for(var i=-1, len = +obj.length; ++i<len; )
                arr.push(obj[i]);
        }
        return arr;
    }


    function selectInArr(arr, begin,end, directArr, condFn)
    {
        var a = typeArg(arguments,1);
        begin = a.num0 || 0;	
        end =	a.num1 || arr.length;
        condFn=	a.fn0;		
        directArr = a.arr0 || [];
        
        for(var i= begin-1; ++i<end; )
            if( condFn(arr[i]) )
                directArr.push(arr[i]);
        return directArr;
    }


    function isTagName(name){
        name = upper(name);
        return function(e){return e.nodeName === name;};
    }

    function isTagNameNot(name){
        name = upper(name);
        return function(e){return upper(e.nodeName) !== name} ;
    } 

    //function NAME(s)		{return document.getElementsByName(s);}
    function QUERY(s,elem)      {return (elem||docc).querySelector(s)}
    function QUERYALL(s,elem)   {return (elem||docc).querySelectorAll(s)}

    function ID(s)  {return docc.getElementById(s);}
    function TAG(s,elem)	
    {
        elem= (elem || docc);
        return (s==="*"&&elem.all) ? elem.all : elem.getElementsByTagName(s);
    }

    function getElemsByClass(s)
    {
        return selectInArr( TAG("*",this), function(elem){
            return has(elem.className.split(" "), s);
        });
    };

    function CLASS(s,elem)	
    {
        elem= (elem || docc);
        elem.getElementsByClassName = elem.getElementsByClassName || getElemsByClass ;
        return elem.getElementsByClassName(s);
    }

    function CHILD()
    {
        var a = typeArg(arguments),
            tagName = a.str0,
            list = (a.htm0 || a.obj0).children;

        return !tagName ? list : selectInArr(list, isTagName(tagName) );
    }

    function SIBLING()
    {
        var a = typeArg(arguments),
            tagName = a.str0,
            elem = a.htm0 || a.obj0,
            list = elem.parentNode.children,
            cmpFn = tagName ? isTagName(tagName) : retTrue ;

        return selectInArr(list, cmpFn, indexOf(list,elem)+1);
    }


    function lessToMoreSelect(arr,fn,name)
    {
    //	if(arr.length===1)
    //		return fn(name,arr[0]);
        var tmp=[];
        each(arr,function(elem){tmp = concatArr(tmp, fn(name,elem))});
        return tmp;
    }

    function ifNegaIndex(arr, n){return n += (n<0 ? arr.length : 0);}

    function slice(arr, begin, end, step)
    {
        begin =	ifNegaIndex(arr, begin);
        end =	ifNegaIndex(arr, (end || arr.length));

        if( !step )
        {
            try {return [].slice.call(arr, begin, end);}
            catch(e){}
        }

        step =	step || 1 ;

        var tmpArr = [];
        for(var i=begin; i<end; i+=step)
            tmpArr.push(arr[i]);
        return tmpArr;
    }

    function selectByNum(arr,n)	{return arr[ifNegaIndex(arr,n)];}


    function timer(fn,args)
    {
        var t1 = new Date();

        fn.apply(this, (args||[]));

        var t2 = new Date();
        return t2-t1;
    }




    function getDisplay(elem)   {return elem.style && elem.style.display || (elem.hidden?"none":"block");}

    function isHidden(elem)
    {
        do{
            if(getDisplay(elem)==="none" || elem.type==="hidden")
                return true;
        }while(elem = elem.parentNode);
        return false;
    }


    function isInputType(e,type){
        return e.type && type==lower(e.type) && "INPUT"==e.nodeName;
    }

    function selectInArrByInputType(arr,type)
    {
        return selectInArr(arr, function(e){return isInputType(e,type);});
    }

    function makeFnSelectByInputType(type)
    {
        return function(arr){return selectInArrByInputType(arr, type);}
    }



    function isOnlyOfType(e)
    {
        var sum = 0, tagName = e.nodeName, list = e.parentNode.children;
        for(var i=0, len = list.length; i < len; ++i)
            if( tagName===list[i].nodeName )
                if(++sum>1) return false ;
        return true;
    }

    function indexOfSiblings(node,n)
    {
        var list = node.parentNode.children,
            i = indexOf(list, node),
            n = n || 0;
        return n<0 ? (i-list.length) : i ;
    }

    function isNodeIndex(e,n){return indexOfSiblings(e,n) === n;}

    function indexOfSiblingsType(node, n)
    {
        var list = selectInArr(node.parentNode.children, isTagName(node.nodeName)),
            i = indexOf(list, node),
            n = n || 0;
        return n<0 ? (i-list.length) : i ;

    /*
            begin = 0, end = list.length, fCmpFn = isLess, step = 1;
        if(n && n<0)
            begin = list.length-1, end = -1, fCmpFn = isMore, step = -1;
        for(var index = 0; fCmpFn(begin, end); begin += step)
        {
            if( cmpFn(list[begin].nodeName, tagName) )
            {
                index += step;
                if(list[begin] === node)
                    return index+(index<0 ? 0 : -1);
            }
        }*/
    }

    function makeFnForNth(arg,indexof)
    {
        indexof = indexof ? indexOfSiblingsType : indexOfSiblings ;
        var fn, n ;
        if( has(["odd","even"],arg) )
            fn = function(e){return (arg==="odd"?isOdd:isEven)(indexof(e));}
        else if(isNum(n = +arg))
        {
            n = n<0? n : n-1 ;//index from 1, not 0
            fn = function(e){return indexof(e,n)===n;}
        }
        else
        {//an + b
            arg = arg.match(/[0-9]+/gi);
            arg[0] = +arg[0] ;
            arg[1] = arg[1] ? (+arg[1]) : 0;
            fn = function(e){return (indexof(e)+1)%arg[0]===arg[1];}
        }//	alert(fn);
        return fn;
    }

    var ns = window;
    ns.ID = ID;
    ns.TAG = TAG;
    ns.CLASS = CLASS;
    ns.typeoff = typeoff;
    ns.timer = timer;
    ns.has = has;
    ns.each = each;
    ns.splitBySpace = splitBySpace;

//========================private function below====================================
//(function(){
	var docc = document, tmpStack=[];

	var notSign = false;
	function notGet(big,small)
	{
		
        if(notSign)
        {
		    var tmp=[];
            notSign = false;
            each(small, function(e,i){if(!e){tmp.push(big[i]);}});
            return tmp;
        }
        else
            return small;
            //each(small, function(e,i){if(e){tmp.push(e);}});
	}

	jFun.cmpSigns =
	{
		"*=":	function(attr,val){return has(attr, val);},
		"^=":	function(attr,val){return attr.indexOf(val) === 0;},
		"$=":	function(attr,val){return val === attr.slice(-1*val.length);},
		"!=":	function(attr,val){return val !== attr;}, 
		"=" :	function(attr,val){return val === attr;}
	};

    jFun.bytecodeList =
    {
        "ID":   function(elem,name){return [ID(name)];}

        ,"CLASS":function(arr,name){	
            return lessToMoreSelect(arr,CLASS,name);
        } 

        ,"TAG": function(arr,name){
            return lessToMoreSelect(arr,TAG,name);
        } 

        ,"#":   function(arr,name){
            return selectInArr(arr, function(e){return e.id===name;});
        }

        ,".":   function(arr,name){
            return selectInArr(arr, function(e){return has(splitBySpace(e.className), name);});
        }

        ,"`":   function(arr,tagName){//tagName select
            return selectInArr(arr, isTagName(upper(tagName)));
        }

        ,">":   function(arr, tagName){
            return lessToMoreSelect(arr,CHILD,tagName);
        }

        ,"~":   function(arr, tagName){
            return lessToMoreSelect(arr,SIBLING,tagName);
        }

        ,"+":   function(arr, tagName)
        {
            var tmpArr = [];
            tagName = tagName ? upper(tagName) : tagName;
            each(arr, function(e)
            {
                var list = e.parentNode.children,
                    i = indexOf(list,e)+1,
                    len = list.length;
                if(i===len) return ;
                if(!tagName){ tmpArr.push(list[i]); return ;}

                for(; i < len; ++i)
                {
                    if(list[i].nodeName !== tagName)
                        continue;
                    tmpArr.push(list[i]);
                    return ;
                }
            });
            return tmpArr;
        }

        ,"[":   function(arr, args)
        {
            var attr = args[0],
                sign = args[1],
                val  = args[2];

            return selectInArr(arr, function(e)
            {
                if(attr==="class")
                {
                    var bool = has(splitBySpace(e.className), val);
                    return sign==="="? bool : (!bool);
                }
                else
                {
                    var att = e.getAttribute(attr);
                    return att === null ? false : jFun.cmpSigns[sign](att, val) ;
                }
            });
        }

        ,":each":   function(arr, selector)
        {
            var tmpArr = [];
            each(arr, function(e,i){
                tmpArr = concatArr(tmpArr, _$([e],selector) );
            });
            return tmpArr;
        }

        ,":not":    function(arr)
        {
            notSign = true;
            return arr;
        }

        ,"(":   function(arr)	
        {
            if(notSign)
            {
                each(arr, function(e,i){e.notIndexArr = i;});
                tmpStack.unshift(new Array(arr.length));
            }
            else
                tmpStack.unshift([]);
            tmpStack.push(arr);
            return arr;
        }

        ,",":   function(arr)	
        {
            if(notSign)
                each(arr,function(e){tmpStack[0][e.notIndexArr] = e;});
            else
                tmpStack[0] = concatArr(tmpStack[0],arr);

            return lastOf(tmpStack);
        }

        ,")":   function(arr)
        {
            if(notSign)
                each(arr,function(e){tmpStack[0][e.notIndexArr] = e;});
            else
                tmpStack[0] = concatArr(tmpStack[0],arr);

            return notGet(tmpStack.pop(), tmpStack.shift());
        }

        ,":first":  function(arr){return [arr[0]];}
        ,":last":   function(arr){return [arr[arr.length-1]];}
        ,":=":      function(arr,arg){return [selectByNum(arr, +arg)];}
        ,":<":      function(arr,arg){return slice(arr, 0, +arg);}
        ,":>":      function(arr,arg){return slice(arr, +arg+1) ;}
        ,":even":   function(arr){return slice(arr, 0, arr.length, 2);}
        ,":odd":    function(arr){return slice(arr, 1, arr.length, 2);}

        ,":header": function(arr){
            return selectInArr(arr, function(e){return /^h\d/i.test(e.nodeName);});
        }

        ,":root":   function(){return TAG("html");}

        ,":contains":function(arr, arg){
            return selectInArr(arr, function(e){return has(e.innerText,arg);});
        }

        ,":empty":  function(arr){
            return selectInArr(arr, function(e){return ! e.firstChild;});
        }

        ,":parent": function(arr){
            return selectInArr(arr, function(e){return e.innerHTML !== "";});
        }

        ,":has":    function(arr, tagName){	//has tagName
            return selectInArr(arr, function(e){return new RegExp("<"+tagName+"[\\s>]", "i").test(e.innerHTML);});
        }

        ,":hidden": function(arr){
            return selectInArr(arr, function(e){return isHidden(e);});
        }

        ,":visible":function(arr){
            return selectInArr(arr, function(e){return ! isHidden(e);});
        }

        ,":input":  function(arr){
            return selectInArr(arr, function(e){
                return has(["INPUT","TEXTAREA","BUTTON","SELECT"], e.nodeName);
            });
        }
        ,":text":   makeFnSelectByInputType("text")
        ,":password":makeFnSelectByInputType("password")
        ,":radio":  makeFnSelectByInputType("radio")
        ,":checkbox":makeFnSelectByInputType("checkbox")
        ,":submit": makeFnSelectByInputType("submit")
        ,":image":  makeFnSelectByInputType("image")
        ,":reset":  makeFnSelectByInputType("reset")
        ,":file":   makeFnSelectByInputType("file")
        ,":reset":  makeFnSelectByInputType("reset")
        ,":button": function(arr){
            return selectInArr(arr, function(e){
                return isInputType(e,"button") || "BUTTON"===e.nodeName;
            });
        }

        ,":enabled":    function(arr){
            return selectInArr(arr, function(e){return !e.disabled;});
        }

        ,":disabled":   function(arr){
            return selectInArr(arr, function(e){return e.disabled;});
        }

        ,":checked":    function(arr){a
            return selectInArr(arr, function(e){
                var name = e.nodeName;
                return (name==="INPUT" && e.checked) || 
                        (name==="OPTION" && e.selected);
            });
        }

        ,":selected":   function(arr, arg){
            return selectInArr(arr, function(e){return e.nodeName==="OPTION" && e.selected;});
        }

        ,":only-child": function(arr){
            return selectInArr(arr, function(e){return e.parentNode.children.length===1;});
        }

        ,":only-of-type":function(arr){
            return selectInArr(arr, function(e){return isOnlyOfType(e);});
        }

        ,":first-child":function(arr)
        {
            //return selectInArr(arr, function(e){return e===e.parentNode.firstChild;});
            return selectInArr(arr, function(e){ return isNodeIndex(e,0); });	
        }

        ,":last-child": function(arr)
        {
            //return selectInArr(arr, function(e){return e===e.parentNode.lastChild;});
            return selectInArr(arr, function(e){ return isNodeIndex(e,-1); });	
        }

        ,":first-of-type":function(arr){
            return selectInArr(arr, function(e){return indexOfSiblingsType(e)===0});
        }

        ,":last-of-type":function(arr){
            return selectInArr(arr, function(e){return indexOfSiblingsType(e,-1)===-1});
        }

        ,":nth-child":  function(arr,arg){
            return selectInArr(arr, makeFnForNth(arg));
        }

        ,":nth-of-type":function(arr, arg){
            return selectInArr(arr, makeFnForNth(arg,"type"));
        }
    /*
        ,":sdf":    function(arr, arg){
            return selectInArr(arr, function(e){return e;});
        }
    */
    };


    function execBytecode(arr, bcs)
    {//*//".class:not([href],[src])"
        for(var i= -1, len = bcs.length; ++i < len; )
        {
            
        //alert(indexOf(jFun.bytecodeList,bcs[i].fn)+":"+bcs[i].arg)
            arr = bcs[i].fn(arr, bcs[i].arg);
        }
    /*/
        each(bcs, function(bc){arr=bc.fn(arr, bc.arg, g);})
    //*/
        return arr;
    }

    function execWord(rs,word)
    {//.class1,.class2
        var midRS = [];
        each(word, function(bytecodes){
            midRS = concatArr( midRS, execBytecode(rs,bytecodes) );
        });
        return midRS;
    }

    function execSentence(rs,sentence)
    {//.class1,.class2  .class3,.class4
        var midRS = rs;
        each(sentence, function(word){
            midRS = execWord(midRS,word);
        });
        return midRS;
    }

    function execTree(rs,tree)
    {//sentence1 ; sentence2
        var midRS = [];
        each(tree, function(sentence){
            midRS = concatArr( midRS, execSentence(rs,sentence) );
        });
        return midRS;
    }

    //var condition = /,|[\.#`][a-z0-9\_\-]+|[>+~][a-z0-9]*|[a-z\*][a-z0-9]*|\[[^\]]+\]|:not\(|\)|:[a-z\=<>][a-z]*\([^\)]+\)|:[a-z\-]+|:[\=<>]-\d|:[\=<>]\d/gi;



    function makeBytecode(type,arg)	
    {//alert(type+":"+arg)
    //	return "RS=jFun.bytecodeList['"+type+"'](RS,'"+arg+"',g);\n";	
        return {"fn":jFun.bytecodeList[type], "arg":arg};
    }

    function splitByCondition(s)
    {
        var //rspace = "[^\\s\\n]+",
            rcomma = ",",
            rclass_id_tag = "[\\.#`]+[a-z0-9\\_\\-]+",
            rtag = "[a-z\\*][a-z0-9]*",
            rnode = "[>+~][a-z0-9]*",
            rattr = "\\[[^\\]]+\\]",
            rnot = ":not(?=\\()|\\(|\\)",
            reach = ":each\\(([^()]+(\\([^()]+\\))*)+\\)",
            rcolon_par = ":[a-z\\=<>][a-z\\-]*\\([^\\)]+\\)",
            rcolon = ":[a-z\\-]+",
            rcolon_sign_nega = ":[\\=<>]-\\d+",
            rcolon_sign = ":[\\=<>]\\d+",
            idReg=/^\#/,
            classReg=/^\./,
            tagReg=/^[a-z\*]/i;
        var condition = new RegExp(rcomma+"|"+rclass_id_tag+"|"+rtag+"|"+rnode+"|"+rattr+"|"+rnot+"|"+reach+"|"+rcolon_par+"|"+rcolon+"|"+rcolon_sign_nega+"|"+rcolon_sign,"gi");

        //alert("str:"+s)
        s = splitBy(s,condition);
          

        for(var i=0, len = s.length; i < len; ++i)
        {//alert(s[i])
            if( /^[a-z\*]/i.test(s[i]) )
                s[i] = makeBytecode("TAG", s[i]) ;
            else if( /^[#`>+~\.]/.test(s[i])  ) 
            {
                s[i] = cutNeck(s[i]);
                if( i===0 && has([".","#"], s[i].head) )
                    s[i] = makeBytecode( s[i].head==="#" ? "ID":"CLASS", s[i].body);
                else
                    s[i] = makeBytecode( s[i].head, s[i].body ) ;
            }
            else if( /^\[/.test(s[i]) )
            {
                s[i] = s[i].substr(1, s[i].length-2);//
                s[i] = splitBy(s[i], /[a-z]+|[\*\^\$\!]|\=.*/gi);

                var arg = [ s[i][0], null, null ] ;
                switch(s[i].length)
                {
                case 3:	arg[1] = s[i][1]+"=" ;
                        arg[2] = sbody(s[i][2]) ;
                        break;
                case 2:	arg[1] = "=" ;
                        arg[2] = sbody(s[i][1]) ;
                        break;
                case 1:	arg[1] = "!=" ;
                        break;
                }
                s[i] = makeBytecode("[", arg) ;
            }
            else if(/^:/.test(s[i]))
            {
                s[i] = splitBy(s[i], /:[\=<>]|:[a-z\-]+|.+/gi);
                if(s[i][1])
                    s[i][1] = s[i][1].replace(/^\(|\)$/gi,"");
                s[i] = makeBytecode(s[i][0], s[i][1]) ;
            }
            else
                s[i] = makeBytecode(s[i]) ;
        }
        return s;
    }


    var splitFn = [splitBySemicolon, splitBySpace, splitByComma, splitByCondition];
    function syntaxTree(str,n)
    {
        var tree = splitFn[n](str);
        if( splitFn[++n] )
            each(tree, function(s){return syntaxTree(s,n)});
        return tree;
    }


    jFun.trees={};
    function _$(rs,str)
    {
        var tree = jFun.trees[str] = jFun.trees[str] || syntaxTree(str,0);
        return execTree( rs, tree );
    }

    jFun.init = function()
    {
        var a = typeArg(arguments),
            selector = a.str0,
            rs = a.except("str0") || docc;
        rs = rs.length===undefined? [rs] : rs;

        if(selector)
            rs = _$(rs, selector);
        return new jFun(rs);
    }

    if(window.$)
        window._$ = window.$;
    window.$ = jFun.init;
    window.$.ready = ready;
    window.$.noConflict = function()
    {
        var tmp; 
        tmp=window.$, window.$=window._$, window._$=tmp;
    }

//==================================================================*/
//==================================================================*/
//=========================jFun.fn==================================*/
//==================================================================*/
//==================================================================*/


    function execEvent(event,target,fnArr)
    {
        if(fnArr)
            each(fnArr, function(fn)
            {
                event.data = fn.data;
                fn.call(target,event);
            });
    }

    function onEvent(event)
    {
        event = event || window.event || arguments.callee.caller.arguments[0];
        var ns, type = event.type;

        if(ns = existNamespace(this,"events",type))
        {
            var target = event.target || event.srcElement;
            
            if(target===this)
            {
                if(!ns["this"]) return ;
                ns = ns["this"];
                execEvent(event,target,ns["always"]);
                execEvent(event,target,ns["one"]);
                ns["one"] = undefined;
            }
            else
            {
                if(!ns["delegate"]) return ;
                ns = ns["delegate"];				
                execEvent(event,target,ns[target.nodeName]);
            }
        }
    }

    function makeEvent(elem,type,target,selector,fn)
    {
        var ns = namespace(elem,"events",type,target);
        if(ns[selector]===undefined)
            ns[selector] = []; 
        ns[selector].push(fn);
        elem["on"+type] = onEvent;
    }

    function getOpacity(elem)
    {
        var t = elem.style.filter;
        t = t && t.match(/\d+/)[0] ;
        return +(elem.style.opacity)*100 || t  ;
    }

    function setOpacity(elem, opacity)
    {
        opacity = Math.round(opacity);
        elem.style.cssText += "zoom:1;filter:Alpha(Opacity="+opacity+");opacity:"+opacity / 100+";";
    /*
        elem.style.zoom=1	//for IE
        elem.style.filter = "Alpha(Opacity="+opacity+")"; 
        elem.style.opacity = opacity / 100; */
    }


    function joinHTML(arr)
    {
        var str="";
        each(arr, function(e)
        {
            if( isStr(e) )	
                str += e;
            else 
                str += e.outerHTML;
        });	
        return str;
    }

    function HTML2Node(arr)
    {
        var div = document.createElement("div");
        div.innerHTML = joinHTML(arr);
        return div.children;
    }

    function insertBefore(newNode,node){//alert(typeoff(newNode))
        node.parentNode.insertBefore(newNode, node);
    }

    function insertAfter(newNode,node)
    {
        var parent = node.parentNode,
            list = parent.children,
            i = indexOf(list,node);

        if(i === list.length-1) 
            parent.appendChild(newNode);
        else
            insertBefore(newNode, list[i+1]);	//node.nextSibling;
    }

    function repalceNode(newNode,oldNode){
        oldNode.parentNode.replaceChild(newNode, oldNode);
    }

    function insertNode(rs, argArr, insertFn)
    {
        var nodes = HTML2Node(argArr);
        each(rs, function(elem)
        {
            var parent = elem.parentNode,
                tmp = parent.cloneNode();

            repalceNode(tmp, parent);//fetch down
            for(var i= nodes.length; --i > -1; )
                insertFn(nodes[i], elem)
            repalceNode(parent, tmp);//back
        });
    //	alert(nodes.length);
    }
    /*
    var str="";
    for(var i in jFun.fn)
    {
        str+= i+" ";
    }
    copyStr(str);
    //*/




    jFun.fn = jFun.prototype = 
    {
        backupStack:[]

        ,$push: function(){this.backupStack.push(this.rs); return this;}

        ,$pop:  function(){this.rs = this.backupStack.pop(); return this;}

        ,each:  function(fn){each(this.rs, fn); return this;}

        ,attr:  function(s)
        {
            var retVal, str = "",
                replaceStr = 
                {
                    ".bgcolor":".style.backgroundColor"
                };
            each(arguments, function(s)
            {
                each(replaceStr, function(val,i){
                    s = s.replaceAll(i, val);
                });

                if( !has(s,"=") ) 
                    retVal = this.rs[0][s];
                else
                {
                    s=s.split("=");
                    if(shead(s[1])===".")
                        s[1]="e"+s[1];
                    str += ("e"+s.join("=")+";")
                }
            });
            if(str)
                this.each(new Function("e","i",str));
            return retVal===undefined ? this : retVal ;
        }


        ,ATTR:  function(attr, val )
        {
            if(val===undefined) 
                return this.rs[0][attr];

            return this.each( isFn(val) ? val : function(e){e[attr] = val} );
        }

        ,text:  function(val){
            return this.ATTR("innerText", val);
        }

        ,html:  function(val){
            return this.ATTR("innerHTML", val);
        }

        ,val:   function(val){
            return this.ATTR("value", val);
        }

        ,append:    function(strs)
        {
            var str = joinHTML( isArrLike(strs)? strs : arguments);
            if( str !== "" )
                var fn = function(elem){elem.innerHTML += str;};
            return this.ATTR("innerHTML", fn);
        }

        ,prepend:   function(strs)
        {
            var str = joinHTML( isArrLike(strs)? strs : arguments);
            if( str !== "" )
                fn = function(elem){elem.innerHTML = str + elem.innerHTML;} ; 
            return this.ATTR("innerHTML", fn);
        }

        ,before:    function(){insertNode(this.rs, arguments, insertBefore); return this;}

        ,after: function(){insertNode(this.rs, arguments, insertAfter); return this;}

        ,empty: function(){return this.html("");}

        ,remove:    function(){return this.each(function(){this.parentNode.removeChild(this)});}
            
        ,css:   function()	//s1,s2...retAttr
        {
            var retVal, str = "",
                replaceStr = 
                {
                    "bg":"background"
                };
            
            each(arguments, function(s)
            {
                each(replaceStr, function(val,i){
                    s = s.replaceAll(i, val);
                });

                if( has(s,":")) 
                    str += (";"+s+";");
                else
                    retVal = this.rs[0].style[s];
            });

            if(str)
                this.each( function(elem){elem.style.cssText += str ;});
            return retVal===undefined ? this : retVal ;
        }

        ,trigger:   function(type,dataArr)
        {
            var event = {"type":type, "target":undefined};
            if( ! isArr(dataArr) )
                 dataArr = [];
            dataArr.unshift(event);

            return this.each(function(elem){ 
                dataArr[0].target = elem;
                elem["on"+type].apply(elem,dataArr); 
            });
        }
        
        ,on:    function()//types[,selector][,data],fn[,one] || [selector,][data,]obj
        {//attachEvent addEventListener
            var a = typeArg(arguments),			
                fn = a.fn0;
            if(fn)
            {
                var types = splitBySpace(a.str0),
                    selector = a.str1,
                    data = a.obj0;

                var obj = {};
                each(types,function(type){
                    obj[type] = fn;
                });
            }
            else
            {
                var selector = a.str0,
                    data = a.obj1 ? a.obj0 : data, 
                    obj =  a.obj1 || a.obj0;
            }
            each(obj, function(fn){fn.data = data;});

            var one = a.bool0,
                target = selector ? "delegate" : "this";
            selector = selector ? upper(selector) : (one ? "one" : "always");

            return this.each(function(elem){
                each(obj, function(fn,type){
                    makeEvent(elem,type,target,selector,fn);
                });
            });
        }

        ,off:   function(types,selector,fn)
        {//detachEvent removeEventListener
            var a = typeArg(arguments),
                types = a.str0,
                selector = a.str1,
                fn = a.fn0;
                 
            if(types)
                types = splitBySpace(types);

            switch(arguments.length)
            {
            case 0:	this.each(function(elem){elem.events = undefined;}); break;

            case 1:	this.each(function(elem){
                        each(types, function(type){
                            elem.events[type] = undefined;
                        });
                    }); 
                    break;
            
            case 2:	
                    if(selector)
                    {
                        if(selector==="*")
                            this.each(function(elem){
                                each(types, function(type){
                                    elem.events[type]["delegate"] = undefined;
                                });
                            }); 
                        else 
                            this.each(function(elem){
                                each(types, function(type){
                                    elem.events[type]["delegate"][selector] = undefined;
                                });
                            }); 
                    }
                    else if(fn)
                    {
                        this.each(function(elem){
                            each(types, function(type){
                                var ns = elem.events[type]["this"]["always"],
                                    i = indexOf(ns,fn);
                                if(i>-1)
                                    ns.splice(i, 1);
                            });
                        }); 
                    }
                    break;

            case 3:	this.each(function(elem){
                        each(types, function(type){
                            var ns = elem.events[type]["delegate"][selector],
                                i = indexOf(ns,fn);
                            if(i>-1)
                                ns.splice(i, 1);
                        });
                    }); 
                    break;
            }
            return this;
        }

        ,one:   function(types,data,fn)
        {
            var arr = [];
            arr.push.apply(arr,arguments);
            arr.push(true);
            return this.on.apply(this,arr);
        }

        ,hover: function(enterFn,leaveFn)
        {
            leaveFn = lastOf(arguments);
            this.mouseleave(leaveFn);

            if(arguments.length>1)	//enterFn
                this.mouseenter(enterFn);
            return this;
        }

        ,hide:  function()
        {
            return this.each(function(e)
            {
                e.style.display = "none";
            });
        }

        ,show:  function()
        {
            return this.each(function(e)
            {
                e.style.display = "block";
            });
        }

        ,toggle:    function()
        {
            switch(arguments.length)
            {
            case 0:	return this[isHidden(this.rs[0]) ? "show" : "hide"]();

            case 1: return this[argArr[0] ? "show" : "hide"]();	//argArr[0]=bool

            default:
                
            }
        }

        ,fade:  function(io,time,fn,limit)
        {
        //	var a = typeArg(arguments,1);
            time = time || 1000 ;
        //	fn = a.fn0;
            
            var swit = { 'in': [isLess,0,100,1], 
                        'out': [isMore,100,0,-1] },
                cmpFn	=	swit[io][0],
                opacity	=	getOpacity(this.rs[0]) || swit[io][1],
                frame	=	40
                speed	=	swit[io][3] * (frame*100/time) ;
                                // opacity/speed==time/frame			
            limit = limit || swit[io][2];

            if(io==="in")
                this.show();
            
            var thiss = this;	//var tt1=new Date();
            (function()
            {
                thiss.each( function(e){setOpacity(e, opacity);} );
                opacity += speed, time -= frame;

                if( cmpFn(opacity, limit) && time>0 )
                    setTimeout(arguments.callee, frame);
                else
                {//var tt2=new Date();alert(tt2+"-"+tt1+"="+(tt2-tt1));
                    if(opacity<1) 
                        thiss.hide();
                    if(fn) 
                        thiss.each(fn);
                }
            })();

            return this;
        }

        ,fadeIn:    function(time,fn)
        {
            var thiss = this;
            setTimeout(function(){thiss.fade.call(thiss,"in",time,fn)}, this.delayTime)
            return this;
        }

        ,fadeOut:   function(time,fn)
        {
            var thiss = this;
            setTimeout(function(){thiss.fade.call(thiss,"out",time,fn)}, this.delayTime)
            return this;
        }

        ,fadeTo:    function(opacity,time,fn)	
        {
            var thiss = this;
            opacity = opacity*100;
            setTimeout(function()
            {
                var opacityNow = getOpacity(thiss.rs[0]) || 100,
                    io = opacityNow > opacity ? "out" : "in" ;
                thiss.fade.call(thiss,io,time,fn,opacity);
            }, this.delayTime);
            return this;
        }

        ,fadeToggle:    function(time,fn)
        {
            var thiss = this;
            setTimeout(function()
            {
                var io = isHidden(thiss.rs[0]) ? "in" : "out";
                thiss.fade.call(thiss,io,time,fn);
            }, this.delayTime)
            return this;
        }
        
        ,delayTime: 0
        ,delay: function(time){
            this.delayTime += time;	
            return this;
        }
    /*
        ,xxxxx: function()
        {
            
        }
    */
    }


    var events="change select submit keydown keypress keyup error contextmenu "+
        "blur focus focusin focusout load resize scroll unload click dblclick "+
        "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave";

    events = splitBySpace(events);
    each(events, function(type)
    {
        jFun.fn[type] = function(data,fn)
        {
            if(arguments.length===0)	//trigger
                return this.each(function(e){e["on"+type]({"type":type, "target":e})});

            var a = typeArg(arguments),
                fn = a.fn0,
                data = a.obj0;
            return this.on(type,data,fn);
        }
    });


    var ns = jFun.bytecodeList;
    ns[":eq"] = ns[":="];
    ns[":lt"] = ns[":<"];
    ns[":gt"] = ns[":>"];

    ns = jFun.fn;
    ns._$ = ns.filter = function(str)
    {
        this.rs = _$(this.rs, str);
        return this;
    }


})();


