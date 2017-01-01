module.exports = {
	"javascript" : {"word":"javascript","value": 1,"parent":null},
		"language" : {"word":"language","value": 1,"parent":"javascript"},
			"grammar" : {"word":"grammar","value": 1,"parent":"language"},
				"whitespace" : {"word":"whitespace","value": 1,"parent":"grammar"},
				"number" : {"word":"number","value": 1,"parent":"grammar"},
				"string" : {"word":"string","value": 1,"parent":"grammar"},
				"literal" : {"word":"literal","value": 1,"parent":"grammar"},
				"keyword" : {"word":"keyword","value": 1,"parent":"grammar"},
				"reserved word" : {"word":"reserved word","value": 1,"parent":"grammar"},
				"comment" : {"word":"comment","value": 1,"parent":"grammar"},
				"operation" : {"word":"operation","value": 1,"parent":"grammar"},
					"++" : {"word":"++","value": 1,"parent":"operation"},
					"--" : {"word":"--","value": 1,"parent":"operation"},
					"+-" : {"word":"+-","value": 1,"parent":"operation"},
					"==" : {"word":"==","value": 1,"parent":"operation"},
			"program structure" : {"word":"program structure","value": 1,"parent":"language"},
				"statement" : {"word":"statement","value": 1,"parent":"program structure"},
				"expression" : {"word":"expression","value": 1,"parent":"program structure"},
					"regular expression" : {"word":"regular expression","value": 1,"parent":"expression"},
						"character" : {"word":"character","value": 1,"parent":"regular expression"},
						"pattern" : {"word":"pattern","value": 1,"parent":"regular expression"},
						"grouping subexpression" : {"word":"grouping subexpression","value": 1,"parent":"regular expression"},
						"matche" : {"word":"matche","value": 1,"parent":"regular expression"},
						"group" : {"word":"group","value": 1,"parent":"regular expression"},
						"date type" : {"word":"date type","value": 1,"parent":"regular expression"},
						"word" : {"word":"word","value": 1,"parent":"regular expression"},
						"string boundaries" : {"word":"string boundaries","value": 1,"parent":"regular expression"},
						"backtracking" : {"word":"backtracking","value": 1,"parent":"regular expression"},
						"search" : {"word":"search","value": 1,"parent":"regular expression"},
						"lastindex" : {"word":"lastindex","value": 1,"parent":"regular expression"},
						"international" : {"word":"international","value": 1,"parent":"regular expression"},
				"conditional" : {"word":"conditional","value": 1,"parent":"program structure"},
					"if" : {"word":"if","value": 1,"parent":"conditional"},
					"else" : {"word":"else","value": 1,"parent":"conditional"},
					"do while" : {"word":"do while","value": 1,"parent":"conditional"},
					"while do" : {"word":"while do","value": 1,"parent":"conditional"},
					"loop" : {"word":"loops","value": 1,"parent":"conditional"},
				"variable" : {"word":"variable","value": 1,"parent":"program structure"},
					"var" : {"word":"var","value": 1,"parent":"variable", "isCode": true},
				"function" : {"word":"function","value": 1,"parent":"program structure", "isCode": true},
					"function objects" : {"word":"function objects","value": 1,"parent":"function"},
					"function literal" : {"word":"function literal","value": 1,"parent":"function"},
					"invocation" : {"word":"invocation","value": 1,"parent":"function"},
					"arguments" : {"word":"arguments","value": 1,"parent":"function"},
					"return" : {"word":"return","value": 1,"parent":"function"},
					"exceptions" : {"word":"exceptions","value": 1,"parent":"function"},
					"augmenting types" : {"word":"augmenting types","value": 1,"parent":"function"},
					"recursion" : {"word":"recursion","value": 1,"parent":"function"},
					"scope" : {"word":"scope","value": 1,"parent":"function"},
					"closure" : {"word":"closure","value": 1,"parent":"function"},
					"callbacks" : {"word":"callbacks","value": 1,"parent":"function"},
					"module" : {"word":"module","value": 1,"parent":"function"},
					"cascade" : {"word":"cascade","value": 1,"parent":"function"},
					"curry" : {"word":"curry","value": 1,"parent":"function"},
					"memoization" : {"word":"memoization","value": 1,"parent":"function"},
					"bind" : {"word":"bind","value": 1,"parent":"function"},
					"call" : {"word":"call","value": 1,"parent":"function"},
					"parseInt" : {"word":"parseInt","value": 1,"parent":"function", isCode: true},
					"higher order function" : {"word":"higher order function","value": 1,"parent":"function"},
				"framework" : {"word":"framework","value": 1,"parent":"program structure"},
					"backbone.js" : {"word":"backbone.js","value": 1,"parent":"framework"},
					"marionette.js" : {"word":"marionette.js","value": 1,"parent":"framework"},
					"marionette" : {"word":"marionette","value": 1,"parent":"framework"},
					"require.js" : {"word":"require.js","value": 1,"parent":"framework"},
					"ionic" : {"word":"ionic","value": 1,"parent":"framework"},
					"angularjs" : {"word":"angularjs","value": 1,"parent":"framework"},
					"cordova" : {"word":"cordova","value": 1,"parent":"framework"},
					"jquery" : {"word":"jquery","value": 1,"parent":"framework"},
			"data structure" : {"word":"data structure","value": 1,"parent":"language"},
				"object" : {"word":"object","value": 1,"parent":"data structure"},
					"object literals" : {"word":"object literals","value": 1,"parent":"object"},
					"retrieval" : {"word":"retrieval","value": 1,"parent":"object"},
					"update" : {"word":"update","value": 1,"parent":"object", isCode: true},
					"reference" : {"word":"reference","value": 1,"parent":"object"},
					"prototype" : {"word":"prototype","value": 1,"parent":"object"},
					"reflection" : {"word":"reflection","value": 1,"parent":"object"},
					"enumeration" : {"word":"enumeration","value": 1,"parent":"object"},
					"delete" : {"word":"delete","value": 1,"parent":"object"},
					"global abatement" : {"word":"global abatement","value": 1,"parent":"object"},
					"inheritance" : {"word":"inheritance","value": 1,"parent":"language"},
						"pseudoclassical" : {"word":"pseudoclassical","value": 1,"parent":"inheritance"},
						"object specifiers" : {"word":"object specifiers","value": 1,"parent":"inheritance"},
						"prototypal" : {"word":"prototypal","value": 1,"parent":"inheritance"},
						"functional" : {"word":"functional","value": 1,"parent":"inheritance"},
						"parts" : {"word":"parts","value": 1,"parent":"inheritance"},
				"array" : {"word":"array","value": 1,"parent":"data structure"},
					"literals" : {"word":"literals","value": 1,"parent":"array"},
					"length" : {"word":"length","value": 1,"parent":"array"},
					"delete" : {"word":"delete","value": 1,"parent":"array"},
					"enumeration" : {"word":"enumeration","value": 1,"parent":"array"},
					"confusion" : {"word":"confusion","value": 1,"parent":"array"},
					"methods" : {"word":"methods","value": 1,"parent":"array"},
					"dimensions" : {"word":"dimensions","value": 1,"parent":"array"},
					"isArray" : {"word":"isArray","value": 1,"parent":"array", "isCode":true},
				
				"JSON" : {"word":"JSON","value": 1,"parent":"data structure"},
					"parse" : {"word":"parse","value": 1,"parent":"JSON", isCode:true},

				"module" : {"word":"module","value": 1,"parent":"data structure"},
					"interface" : {"word":"Interface","value": 1,"parent":"module"},
					"module pattern" : {"word":"module pattern","value": 1,"parent":"module"},
					"asynchronous module" : {"word":"asynchronous module","value": 1,"parent":"module"},
					"npm" : {"word":"npm","value": 1,"parent":"module"},
					"es6 module" : {"word":"es6 module","value": 1,"parent":"module"},
						"import" : {"word":"import","value": 1,"parent":"es6 module", isCode:true},
						"exports" : {"word":"exports","value": 1,"parent":"es6 module", isCode:true},
			"testing" : {"word":"testing","value": 1,"parent":"language"}, 
				"logging" : {"word":"logging","value": 1,"parent":"testing"}, 
				"error handling" : {"word":"error handling","value": 1,"parent":"testing"},
					"strict mode" : {"word":"strict mode","value": 1,"parent":"error handling"},
						"use strict" : {"word":"use strict","value": 1,"parent":"strict mode", isCode:true},
					"assertions" : {"word":"assertions","value": 1,"parent":"error handling"},		
					"debugging" : {"word":"debugging","value": 1,"parent":"error handling"},
					"error propagation" : {"word":"error propagation","value": 1,"parent":"error handling"},
					"exceptions" : {"word":"exceptions","value": 1,"parent":"error handling"},
					"selective catching" : {"word":"selective catching","value": 1,"parent":"error handling"},
			"security" : {"word":"security","value": 1,"parent":"language"}, 
				"validate" : {"word":"validate","value": 1,"parent":"security"}, 
		"web api" : {"word":"web api","value": 1,"parent":"javascript"},
			"console" : {"word":"console","value": 1,"parent":"web api"},
				"log" : {"word":"log","value": 1,"parent":"console"},
				"error" : {"word":"error","value": 1,"parent":"console"},
			"cache" : {"word":"cache","value": 1,"parent":"web api"},
				"CacheStorage" : {"word":"CacheStorage","value": 1,"parent":"cache", isCode: true},
			"dom" : {"word":"dom","value": 1,"parent":"web api"},
				"addEventListener" : {"word":"addEventListener","value": 1,"parent":"dom", isCode: true},
				
				"window" : {"word":"window","value": 1,"parent":"dom", isCode: true},
					"location" : {"word":"location","value": 1,"parent":"dom", isCode: true},
					"alert" : {"word":"alert","value": 1,"parent":"dom", isCode: true},
					"setInterval" : {"word":"setInterval","value": 1,"parent":"dom", isCode: true},
				"document" : {"word":"document","value": 1,"parent":"dom", isCode: true},
					"getElementById" : {"word":"getElementById","value": 1,"parent":"dom", isCode: true},
				"element" : {"word":"element","value": 1,"parent":"dom", isCode: true},
					"innerHTML" : {"word":"innerHTML","value": 1,"parent":"element", isCode: true},

				"ajax" : {"word":"ajax","value": 1,"parent":"dom"},
				"XMLHttpRequest" : {"word":"XMLHttpRequest","value": 1,"parent":"dom", isCode: true},
					"onreadystatechange" : {"word":"onreadystatechange","value": 1,"parent":"XMLHttpRequest", isCode: true},


				"trees" : {"word":"trees","value": 1,"parent":"dom"},
				"standard" : {"word":"standard","value": 1,"parent":"dom"},
				"finding elements" : {"word":"finding elements","value": 1,"parent":"dom"},
				"changing the document" : {"word":"changing the document","value": 1,"parent":"dom"},
				"creating nodes" : {"word":"creating nodes","value": 1,"parent":"dom"},
				"attributes" : {"word":"attributes","value": 1,"parent":"dom"},
				"layout" : {"word":"layout","value": 1,"parent":"dom"},
				"styling" : {"word":"styling","value": 1,"parent":"dom"},
				"cascading styles" : {"word":"cascading styles","value": 1,"parent":"dom"},
				"query selectors" : {"word":"query selectors","value": 1,"parent":"dom"},
				"positioning and animating" : {"word":"positioning and animating","value": 1,"parent":"dom"},
				"event" : {"word":"event","value": 1,"parent":"dom"},
					"event handlers" : {"word":"event handlers","value": 1,"parent":"event"},

					"event and dom nodes" : {"word":"event and dom nodes","value": 1,"parent":"event"},
					"event objects" : {"word":"event objects","value": 1,"parent":"event"},
					"propagation" : {"word":"propagation","value": 1,"parent":"event"},
					"default actions" : {"word":"default actions","value": 1,"parent":"event"},
					"key event" : {"word":"key event","value": 1,"parent":"event"},
					"click" : {"word":"click","value": 1,"parent":"event"},
					"motion" : {"word":"motion","value": 1,"parent":"event"},
					"scroll" : {"word":"scroll","value": 1,"parent":"event"},
					"focus" : {"word":"focus","value": 1,"parent":"event"},
					"load" : {"word":"load","value": 1,"parent":"event"},
					"script execution timeline" : {"word":"script execution timeline","value": 1,"parent":"event"},
					"setting timers" : {"word":"setting timers","value": 1,"parent":"event"},
					"debouncing" : {"word":"debouncing","value": 1,"parent":"event"},
			"canvas" : {"word":"canvas","value": 1,"parent":"web api"},
				"svg" : {"word":"svg","value": 1,"parent":"canvas"},
				"filling and stroking" : {"word":"filling and stroking","value": 1,"parent":"canvas"},
				"paths" : {"word":"paths","value": 1,"parent":"canvas"},
				"curves" : {"word":"curves","value": 1,"parent":"canvas"},
				"text" : {"word":"text","value": 1,"parent":"canvas"},
				"images" : {"word":"images","value": 1,"parent":"canvas"},
				"transformation" : {"word":"transformation","value": 1,"parent":"canvas"},
				"storing and clearing transformations" : {"word":"storing and clearing transformations","value": 1,"parent":"canvas"},
			"http" : {"word":"http","value": 1,"parent":"web api"},
		"related languages" : {"word":"web api","value": 1,"parent":"javascript"},
			"html" : {"word":"html","value": 1,"parent":"related languages"},
			"css" : {"word":"css","value": 1,"parent":"related languages"},
				"bootstrap" : {"word":"bootstrap","value": 1,"parent":"css"},

};