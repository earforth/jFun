练手之作, 本想研究一下jQuery的代码, 但看它写得很绕, 有点看不进去, 于是就按照jQuery的外在表现, 尝试自己用函数做一个,叫

jFunc,后来考虑到命名污染的问题,还是改成了对象版,名字就叫jFun吧

目前可用的方法有:

$push $pop each attr ATTR text html val append prepend before after empty remove css trigger on off one hover 

hide show toggle fadeIn fadeOut fadeTo fadeToggle delay filter _$ 

以及所有事件方法(click之类)


一些特点:

选择器会解析第一次遇到的字符串,然后编译成字节码并保存起来,下次直接调用字节码

与CSS选择器的规则不完全相同,分割优先级: ";" > 空格 > ","

CSS: "div.class1,div.class2"

jFun:"div(.class1,.class2)"


CSS: "div .class1,div .class2"

jFun:"div .class1;div .class2"或"div .class1,.class2"


css和attr方法跟jQuery有些区别,例如:

$("p").css("color:red;bg:yellow").attr(".alt='this is p'")



不会在以":"和"["开头的搜索语句前自动补全"\*", 只能写成"\*[href$=.jpg]"之类, 以方便字节码调用

为性能考虑,":not"不支持嵌套":not"(若有需要再支持嵌套:not)

增加了":=",":>",":<", 等同于":eq",":gt",":lt"(":eq",":gt",":lt"也保留)

不过它们的参数可以不带括号,例如

":=0",":=(0)"都行

添加了一个":each",可以接":first|:last|:=|:>|:<" :

$("ul :each(li:=4)")选择了每一个ul下所有子级和"孙级"的第5个li

虽然有":nth-child"这种东西,但速度上比":each"要慢很多, 只要不是必须选择子级元素, 可以用":each"代替child选择

