java -jar ../../../../tools/jscomp/compiler.jar \
--compilation_level ADVANCED_OPTIMIZATIONS \
--js_output_file out.js \
--jscomp_warning checkVars \
--jscomp_warning undefinedVars \
--jscomp_warning missingProperties \
--js ../js/circularqueue.js \
--js ../js/gameutil.js \
--js ../js/skipqueue.js \
--js ../js/util.js \
--js ../js/vec2d.js \
--js ../js/plex/array.js \
--js ../js/plex/point.js \
--js ../js/plex/rect.js \
--js ../js/plex/type.js \
--js ../js/gaam/cellcollider.js \
--js ../js/gaam/cellentryevent.js \
--js ../js/gaam/cellgroup.js \
--js ../js/gaam/hit.js \
--js ../js/gaam/mark.js \
--js ../js/gaam/phy.js \
--js ../js/gaam/rayScan.js \
--js ../js/gaam/sledge.js \
--js ../js/gaam/sprite.js \
--js ../js/gaam/spritetimeout.js \
--js ../js/gaam/wham.js \
--js sprites/blocksprite.js \
--js sprites/exitsprite.js \
--js sprites/playersprite.js \
--js sprites/portalsprite.js \
--js sprites/wallsprite.js \
--js sprites/zappersprite.js \
--js renderer.js \
--js vorp.js \
--js vorpwham.js
rm out.js

#--js level.js \
