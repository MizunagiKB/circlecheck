# -*- coding: utf-8 -*-
##
import	sys
import	string
import	csv
import	json
import	collections


dictLayout	= {}

# { "layout" : "戦姫01", "circle" : "わたがし", "writer" : "かかお", "url" : "http://watagashi.net" },

oCReader = csv.reader(open(sys.argv[ 1 ], "rb"), delimiter = ',')

for tplRecord in oCReader:
	
	dictRecord	= collections.OrderedDict()
	
	for idx, kwd in ((3, "layout"), (0, "circle"), (1, "writer"), (2, "url")):
		s	= tplRecord[ idx ].strip()
		if( s != "　" and len( s ) > 0 ):
			dictRecord[ kwd ]	= s

	strLB	= dictRecord[ "layout" ].decode( "utf-8" )[ 0 ]
#	print strLB


	if( strLB in dictLayout ):
		dictLayout[ strLB ].append( dictRecord )
	else:
		dictLayout[ strLB ]	= [ dictRecord ]

for k, listItem in dictLayout.items():

	listBuffer	= []

	for o in sorted( listItem, key = lambda obj: obj[ "layout" ] ):
		listBuffer.append( json.dumps( o, ensure_ascii = False ) )

	print "<!-- %s -->" % k.encode( "utf-8" )
	print ",\n".join( listBuffer )
	print

#	pass
	


#for strLine in string.split( hFile.read(), "\n" ):

#	strCircle, strWriter, strUrl, strLayout, x	= string.split( strLine, "\t" )

#	print '{ "layout" : "%s", "circle" : "%s", "writer" : "%s", "url" : "%s" },' % ( strLayout, strCircle, strWriter, strUrl, )