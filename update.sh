echo "============================================"
echo 
echo "flybook —— 基于node&express的轻量级博客"
echo "https://github.com/flymysql/flybook/.git"
echo
echo "============================================"

if [ ! -d "flybook" ]; then
git clone https://github.com/flymysql/flybook.git
else
cd flybook
git pull
cd ..
fi
sh flybook/update_list.sh