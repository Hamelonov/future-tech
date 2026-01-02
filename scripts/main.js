import Header from './Header.js'
import TabsCollection from './Tabs.js'
import videoPlayerCollection from './Videoplayer.js'
import defineScrollBarWidthCSSVar from './defineScrollBarWidthCSSVar.js'
import ExpandableContentCollection from './ExpandableContent.js'
import SelectCollection from './Select.js'

defineScrollBarWidthCSSVar()

new Header()
new TabsCollection()
new videoPlayerCollection()
new ExpandableContentCollection()
new SelectCollection()
