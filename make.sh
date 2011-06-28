echo "MAKING THE PLEXODE"

bdir="../../build/plexode"

echo "removing build"
rm -rf $bdir

echo "creating build"
mkdir $bdir

echo "copying most stuff to build"
cp -r cgi-bin public_html $bdir

echo "generating stuff using Python..."

echo "eval"
mkdir -p $bdir/public_html/eval
python py/eval.py > $bdir/public_html/eval/index.html

echo "eval2"
mkdir -p $bdir/public_html/eval2
python py/eval2.py > $bdir/public_html/eval2/index.html

echo "eval3"
mkdir -p $bdir/public_html/eval3
python py/eval3.py > $bdir/public_html/eval3/index.html

echo "eval3quirks"
mkdir -p $bdir/public_html/eval3quirks
python py/eval3quirks.py > $bdir/public_html/eval3quirks/index.html

echo "fracas"
mkdir -p $bdir/public_html/fracas
python py/fracas.py > $bdir/public_html/fracas/index.html

echo "fracas2"
mkdir -p $bdir/public_html/fracas2
python py/fracas2.py > $bdir/public_html/fracas2/index.html

echo "insta-html"
mkdir -p $bdir/public_html/insta-html
python py/insta-html.py > $bdir/public_html/insta-html/index.html

echo "main"
python py/main.py > $bdir/public_html/index.html

echo "vorp"
python py/vorp.py > $bdir/public_html/vorp/index.html
mkdir -p $bdir/public_html/vorp
mkdir -p $bdir/public_html/vorp/level1
mkdir -p $bdir/public_html/vorp/level2
mkdir -p $bdir/public_html/vorp/level3
mkdir -p $bdir/public_html/vorp/level4
mkdir -p $bdir/public_html/vorp/level5
mkdir -p $bdir/public_html/vorp/level6
mkdir -p $bdir/public_html/vorp/level7
python py/vorp/level1.py > $bdir/public_html/vorp/level1/index.html
python py/vorp/level2.py > $bdir/public_html/vorp/level2/index.html
python py/vorp/level3.py > $bdir/public_html/vorp/level3/index.html
python py/vorp/level4.py > $bdir/public_html/vorp/level4/index.html
python py/vorp/level5.py > $bdir/public_html/vorp/level5/index.html
python py/vorp/level6.py > $bdir/public_html/vorp/level6/index.html
python py/vorp/level7.py > $bdir/public_html/vorp/level7/index.html

find $bdir/public_html -name "index.html" -print | xargs wc

echo "Ding!  Your Plexode is ready to eat!"
