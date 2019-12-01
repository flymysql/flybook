rm -rf flybook
echo "============================================"
echo 
echo "flybook —— 基于node&express的轻量级博客"
echo "https://github.com/flymysql/flybook/.git"
echo
echo "============================================"
git clone https://github.com/flymysql/flybook.git
sh ./update_list.sh
cp flybook/update_list.sh ./
rm -rf flybook