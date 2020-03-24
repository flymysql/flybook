function _BigInt_toString()
{
    return this.toStringBase(10);
}
function _BigInt_toStringBase(base)
{
    var i, j, hbase;
    var t;
    var ds;
    var c;

    i = this.len;
    if(i == 0)
      return "0";
    if(i == 1 && !this.digits[0])
      return "0";

    switch(base) {
      default:
      case 10:
      j = Math.floor((2*8*i*241)/800)+2;
      hbase = 10000;
      break;

      case 16:
      j = Math.floor((2*8*i)/4)+2;
      hbase = 0x10000;
      break;

      case 8:
      j = (2*8*i)+2;
      hbase = 010000;
      break;

      case 2:
      j = (2*8*i)+2;
      hbase = 020;
      break;
    }

    t = this.clone();
    ds = t.digits;
    s = "";

    while (i && j) {
      var k = i;
      var num = 0;

      while (k--) {
	num = (num<<16) + ds[k];
	if(num < 0) num += 4294967296;
	ds[k] = Math.floor(num / hbase);
	num %= hbase;
      }

      if (ds[i-1] == 0)
        i--;
      k = 4;
      while (k--) {
	c = (num % base);
	s = "0123456789abcdef".charAt(c) + s;
	--j;
	num = Math.floor(num / base);
	if (i == 0 && num == 0) {
	  break;
	}
      }
    }

    i = 0;
    while(i < s.length && s.charAt(i) == "0")
      i++;
    if(i)
      s = s.substring(i, s.length);
    if(!this.sign)
      s = "-" + s;
    return s;
}
function _BigInt_clone()
{
  var x, i;

  x = new BigInt(this.len, this.sign);
  for(i = 0; i < this.len; i++)
    x.digits[i] = this.digits[i];
  return x;
}

function BigInt(len, sign)
{
  var i, x, need_init;

  // Setup member functions.
  // Note: There is G.C. bug of function() in Netscape!
  //       Don't use anonymous function.
  this.toString = _BigInt_toString;
  this.toStringBase = _BigInt_toStringBase;
  this.clone = _BigInt_clone;

  if(BigInt.arguments.length == 0) {
    this.sign = true;
    this.len = len = 1;
    this.digits = new Array(1);
    need_init = true;
  } else if(BigInt.arguments.length == 1) {
    x = bigint_from_any(BigInt.arguments[0]);
    if(x == BigInt.arguments[0])
      x = x.clone();
    this.sign = x.sign;
    this.len = x.len;
    this.digits = x.digits;
    need_init = false;
  } else {
    this.sign = (sign ? true : false);
    this.len = len;
    this.digits = new Array(len);
    need_init = true;
  }

  if(need_init) {
    for(i = 0; i < len; i++)
      this.digits[i] = 0;
  }
}

function bigint_norm(x)
{
  var len = x.len;
  var ds = x.digits;

  while(len-- && !ds[len])
    ;
  x.len = ++len;
  return x;
}

function bigint_from_int(n)
{
  var sign, big, i;

  if(n < 0) {
    n = -n;
    sign = false;
  } else
    sign = true;
  n &= 0x7fffffff;

  if(n <= 0xffff) {
    big = new BigInt(1, 1);
    big.digits[0] = n;
  } else {
    big = new BigInt(2, 1);
    big.digits[0] = (n & 0xffff);
    big.digits[1] = ((n>>16) & 0xffff);
  }
  return big;
}

function bigint_from_string(str, base)
{
  var str_i;
  var sign = true;
  var c;
  var len;
  var z;
  var zds;
  var num;
  var i;
  var blen = 1;

  str += "@";	// Terminator;

  str_i = 0;
  // TODO: skip white spaces

  if(str.charAt(str_i) == "+") {
    str_i++;
  }
  else if (str.charAt(str_i) == "-") {
    str_i++;
    sign = false;
  }

  if (str.charAt(str_i) == "@")
    return null;

  if (!base) {
    if (str.charAt(str_i) == "0") {
      c = str.charAt(str_i + 1);
      if (c == "x" || c == "X") {
	base = 16;
      }
      else if (c == "b" || c == "B") {
	base = 2;
      }
      else {
	base = 8;
      }
    }
    else {
      base = 10;
    }
  }

  if (base == 8) {
    while (str.charAt(str_i) == "0")
      str_i++;
    len = 3 * (str.length - str_i);
  }
  else {			// base == 10, 2 or 16
    if (base == 16 && str.charAt(str_i) == '0' && (str.charAt(str_i+1) == "x" || str.charAt(str_i+1) == "X")) {
      str_i += 2;
    }
    if (base == 2 && str.charAt(str_i) == '0' && (str.charAt(str_i+1) == "b"||str.charAt(str_i+1) == "B")) {
      str_i += 2;
    }
    while (str.charAt(str_i) == "0")
      str_i++;
    if (str.charAt(str_i) == "@") str_i--;
    len = 4 * (str.length - str_i);
  }

  len = (len>>4)+1;
  z = new BigInt(len, sign);
  zds = z.digits;

  while(true) {
    c = str.charAt(str_i++);
    if(c == "@")
      break;
    switch (c) {
    case '0': c = 0; break;
    case '1': c = 1; break;
    case '2': c = 2; break;
    case '3': c = 3; break;
    case '4': c = 4; break;
    case '5': c = 5; break;
    case '6': c = 6; break;
    case '7': c = 7; break;
    case '8': c = 8; break;
    case '9': c = 9; break;
    case 'a': case 'A': c = 10; break;
    case 'b': case 'B': c = 11; break;
    case 'c': case 'C': c = 12; break;
    case 'd': case 'D': c = 13; break;
    case 'e': case 'E': c = 14; break;
    case 'f': case 'F': c = 15; break;
    default:
      c = base;
      break;
    }
    if (c >= base)
      break;

    i = 0;
    num = c;
    while(true) {
      while (i<blen) {
	num += zds[i]*base;
	zds[i++] = (num & 0xffff);
	num >>>= 16;
      }
      if (num) {
	blen++;
	continue;
      }
      break;
    }
  }
  return bigint_norm(z);
}

function bigint_from_any(x)
{
  if(typeof(x) == "object") {
    if(x.constructor == BigInt)
      return x;
    return BigInt(1, 1);
  }

  if(typeof(x) == "string") {
    return bigint_from_string(x);
  }

  if(typeof(x) == "number") {
    var i, x1, x2, fpt, np;

    if(-2147483647 <= x && x <= 2147483647) {
      return bigint_from_int(x);
    }
    x = x + "";
    i = x.indexOf("e", 0);
    if(i == -1)
      return bigint_from_string(x);
    x1 = x.substr(0, i);
    x2 = x.substr(i+2, x.length - (i+2));

    fpt = x1.indexOf(".", 0);
    if(fpt != -1) {
      np = x1.length - (fpt+1);
      x1 = x1.substr(0, fpt) + x1.substr(fpt+1, np);
      x2 = parseInt(x2) - np;
    } else {
      x2 = parseInt(x2);
    }
    while(x2-- > 0) {
      x1 += "0";
    }
    return bigint_from_string(x1);
  }
  return BigInt(1, 1);
}

function bigint_uminus(x)
{
  var z = x.clone();
  z.sign = !z.sign;
  return bigint_norm(z);
}

function bigint_add_internal(x, y, sign)
{
  var z;
  var num;
  var i, len;

  sign = (sign == y.sign);
  if (x.sign != sign) {
    if (sign)
      return bigint_sub_internal(y, x);
    return bigint_sub_internal(x, y);
  }

  if (x.len > y.len) {
    len = x.len + 1;
    z = x; x = y; y = z;
  } else {
    len = y.len + 1;
  }
  z = new BigInt(len, sign);

  len = x.len;
  for (i = 0, num = 0; i < len; i++) {
    num += x.digits[i] + y.digits[i];
    z.digits[i] = (num & 0xffff);
    num >>>= 16;
  }
  len = y.len;
  while (num && i < len) {
    num += y.digits[i];
    z.digits[i++] = (num & 0xffff);
    num >>>= 16;
  }
  while (i < len) {
    z.digits[i] = y.digits[i];
    i++;
  }
  z.digits[i] = (num & 0xffff);
  return bigint_norm(z);
  //  return z;
}

function bigint_sub_internal(x, y)
{
  var z = 0;
  var zds;
  var num;
  var i;

  i = x.len;
  // if x is larger than y, swap
  if (x.len < y.len) {
    z = x; x = y; y = z;	// swap x y
  }
  else if (x.len == y.len) {
    while (i > 0) {
      i--;
      if (x.digits[i] > y.digits[i]) {
	break;
      }
      if (x.digits[i] < y.digits[i]) {
	z = x; x = y; y = z;	// swap x y
	break;
      }
    }
  }

  z = new BigInt(x.len, (z == 0) ? 1 : 0);
  zds = z.digits;

  for (i = 0, num = 0; i < y.len; i++) { 
    num += x.digits[i] - y.digits[i];
    zds[i] = (num & 0xffff);
    num >>>= 16;
  } 
  while (num && i < x.len) {
    num += x.digits[i];
    zds[i++] = (num & 0xffff);
    num >>>= 16;
  }
  while (i < x.len) {
    zds[i] = x.digits[i];
    i++;
  }
    
  return bigint_norm(z);
}

function bigint_plus(x, y)
{
  x = bigint_from_any(x);
  y = bigint_from_any(y);
  return bigint_add_internal(x, y, 1);
}

function bigint_minus(x, y)
{
  x = bigint_from_any(x);
  y = bigint_from_any(y);
  return bigint_add_internal(x, y, 0);
}

function bigint_mul(x, y)
{
  var i, j;
  var n = 0;
  var z;
  var zds, xds, yds;
  var dd, ee;
  var ylen;

  x = bigint_from_any(x);
  y = bigint_from_any(y);

  j = x.len + y.len + 1;
  z = new BigInt(j, x.sign == y.sign);

  xds = x.digits;
  yds = y.digits;
  zds = z.digits;
  ylen = y.len;
  while (j--)
    zds[j] = 0;
  for (i = 0; i < x.len; i++) {
    dd = xds[i]; 
    if (dd == 0)
      continue;
    n = 0;
    for (j = 0; j < ylen; j++) {
      ee = n + dd * yds[j];
      n = zds[i + j] + ee;
      if (ee)
	zds[i + j] = (n & 0xffff);
      n >>>= 16;
    }
    if (n) {
      zds[i + j] = n;
    }
  }

  return bigint_norm(z);
}

function bigint_divmod(x, y, modulo)
{
  var nx = x.len;
  var ny = y.len;
  var i, j;
  var yy, z;
  var xds, yds, zds, tds;
  var t2;
  var num;
  var dd, q;
  var ee;
  var mod, div;

  yds = y.digits;
  if (ny == 0 && yds[0] == 0)
    return null;	// Division by zero

  if (nx < ny || nx == ny && x.digits[nx - 1] < y.digits[ny - 1]) {
    if (modulo)
      return bigint_norm(x);
    return BigInt(1, 1);
  }

  xds = x.digits;
  if (ny == 1) {
    dd = yds[0];
    z = x.clone();
    zds = z.digits;
    t2 = 0;
    i = nx;
    while (i--) {
      t2 = t2 * 65536 + zds[i];
      zds[i] = (t2 / dd) & 0xffff;
      t2 %= dd;
    }
    z.sign = (x.sign == y.sign);
    if (modulo) {
      if (!x.sign)
	t2 = -t2;
      if (x.sign != y.sign) {
	t2 = t2 + yds[0] * (y.sign ? 1 : -1);
      }
      return bigint_from_int(t2);
    }
    return bigint_norm(z);
  }

  z = new BigInt(nx == ny ? nx + 2 : nx + 1,
		 x.sign == y.sign);
  zds = z.digits;
  if (nx == ny)
    zds[nx + 1] = 0;
  while (!yds[ny - 1])
    ny--;
  if ((dd = ((65536/(yds[ny-1]+1)) & 0xffff)) != 1) {
    yy = y.clone();
    tds = yy.digits;
    j = 0;
    num = 0;
    while (j<ny) {
      num += yds[j]*dd;
      tds[j++] = num & 0xffff;
      num >>= 16;
    }
    yds = tds;
    j = 0;
    num = 0;
    while (j<nx) {
      num += xds[j] * dd;
      zds[j++] = num & 0xffff;
      num >>= 16;
    }
    zds[j] = num & 0xffff;
  }
  else {
    zds[nx] = 0;
    j = nx;
    while (j--) zds[j] = xds[j];
  }
  j = nx==ny?nx+1:nx;
  do {
    if (zds[j] ==  yds[ny-1]) q = 65535;
    else q = ((zds[j]*65536 + zds[j-1])/yds[ny-1]) & 0xffff;
    if (q) {
      i = 0; num = 0; t2 = 0;
      do {			// multiply and subtract
	t2 += yds[i] * q;
	ee = num - (t2 & 0xffff);
	num = zds[j - ny + i] + ee;
	if (ee) zds[j - ny + i] = num & 0xffff;
	num >>= 16;
	t2 >>>= 16;
      } while (++i < ny);
      num += zds[j - ny + i] - t2; // borrow from high digit; don't update
      while (num) {		// "add back" required
	i = 0; num = 0; q--;
	do {
	  ee = num + yds[i];
	  num = zds[j - ny + i] + ee;
	  if (ee) zds[j - ny + i] = num & 0xffff;
	  num >>= 16;
	} while (++i < ny);
	num--;
      }
    }
    zds[j] = q;
  } while (--j >= ny);

  if (modulo) {			// just normalize remainder
    mod = z.clone();
    if (dd) {
      zds = mod.digits;
      t2 = 0; i = ny;
      while (i--) {
	t2 = (t2*65536) + zds[i];
	zds[i] = (t2 / dd) & 0xffff;
	t2 %= dd;
      }
    }
    mod.len = ny;
    mod.sign = x.sign;
    if (x.sign != y.sign) {
      return bigint_add_internal(mod, y, 1);
    }
    return bigint_norm(mod);
  }

  div = z.clone();
  zds = div.digits;
  j = (nx==ny ? nx+2 : nx+1) - ny;
  for (i = 0;i < j;i++) zds[i] = zds[i+ny];
  div.len = i;
  return bigint_norm(div);
}

function bigint_div(x, y)
{
  x = bigint_from_any(x);
  y = bigint_from_any(y);
  return bigint_divmod(x, y, 0);
}

function bigint_mod(x, y)
{
  x = bigint_from_any(x);
  y = bigint_from_any(y);
  return bigint_divmod(x, y, 1);
}

function bigint_cmp(x, y)
{
  var xlen;

  if(x == y)
    return 0;	// Same object

  x = bigint_from_any(x);
  y = bigint_from_any(y);
  xlen = x.len;

  if(x.sign != y.sign) {
    if(x.sign)
      return 1;
    return -1;
  }

  if (xlen < y.len)
    return (x.sign) ? -1 : 1;
  if (xlen > y.len)
    return (x.sign) ? 1 : -1;

  while(xlen-- && (x.digits[xlen] == y.digits[xlen]))
    ;
  if (-1 == xlen)
    return 0;
  return (x.digits[xlen] > y.digits[xlen]) ?
    (x.sign ? 1 : -1) :
    (x.sign ? -1 : 1);
}

function bigint_number(x)
{
  var d = 0.0;
  var i = x.len;
  var ds = x.digits;

  while (i--) {
    d = ds[i] + 65536.0 * d;
  }
  if (!x.sign) d = -d;
  return d;
}

var addtract =function (a, b) {
  var carry = 0;
  var result = [];
  var len = Math.max(a.length, b.length);
  var i = len;
  while (i--) {
      var sum = (+a[i - len + a.length] || 0) + (+b[i - len + b.length] || 0) + carry;
      carry = parseInt(sum / 10);
      result.unshift(sum % 10);
  }
  if (carry) result.unshift(carry);
  return result.join('');
};


var subtract = function(a, b){ 
  var ltrimZero = function(str){
      var i = 0;
      while(i<str.length && str.charAt(i) === "0"){
          i++
      }
      return str.slice(i); 
  };
  var result = [];  
  //是否有借位  
  var minusOne = 0;  
  //去掉a,b开头的0  
  a = ltrimZero(a);  
  b = ltrimZero(b);  
  //补零对齐  
  while(a.length < b.length){  
      a = "0" + a;  
  }  
  while(b.length < a.length){  
      b = "0" + b;  
  }  
  //从后面位数往前相减  
  for(var i=a.length-1;i>=0;i--){  
      var c1 = a.charAt(i) - 0;  
      var c2 = b.charAt(i) - 0;  
      //如果当前位数无须借位  
      if(c1 - minusOne >= c2){  
          result.unshift(c1 - c2 - minusOne);  
          minusOne = 0;  
      }  
      else{  
          result.unshift(c1 + 10 - c2 - minusOne);  
          minusOne = 1;  
      }  
  }  
  //如果最高位仍然要借位  
  //比如："99999" - "100000"  
  if(minusOne){  
      //=> -(100000 - 99999) => -1  
      var newResult = subtract(b, a);  
      newResult = ltrimZero(newResult);  
      return "-" + newResult;         
  }  
  result = result.join("");  
  result = ltrimZero(result);  
  return result ? result : "0";  
};

function add_plus(x, y){
  var a = x.toString();
  var b = y.toString();
  if (a == "0") return y;
  if (b == "0") return x;
  if (a[0] != '-' && b[0] != '-'){
    return new BigInt(addtract(a, b));
  }
  if (a[0] == '-' && b[0] != '-') {
    return new BigInt(subtract(b, a.substr(1, a.length)));
  }
  if (a[0] != '-' && b[0] == '-') {
    return new BigInt(subtract(a, b.substr(1, b.length)));
  }
  if (a[0] == '-' && b[0] == '-') {
    return new BigInt('-' + addtract(a, b));
  }
}

// console.log(keys[0][0].toString())
function sub_plus(x, y){
  var a = x.toString();
  var b = y.toString();
  if (a == "0" && b[0] != '-' && b[0] != '0') {
    return new BigInt('-' + b);
  }
  if (b[0] == '-') {
    return add_plus(new BigInt(b.substr(1, b.length)), x)
  }
  return bigint_add_internal(x, y);
}


function toBin(str){
  var arr = [];
  var remainder,i,str2,num,char;
  while(str.length>0) {
    str2 = "";remainder=0;
    for(i=0;i<str.length;i++) { // str2 = str组成的十进制数 / 2
      num = str.charCodeAt(i)-0x30; // num to String
      num = remainder*10 + num;
      char = Math.floor(num/2).toString();
      // 忽略最高为的0 ， 即最高为如果是 0 则不放入 str2
      if(!(char === "0" && str2 === "")) { str2 += char;}
      remainder = num%2;
    }
    str = str2;
    arr.push(remainder); // 保存余数
  }
  return arr.reverse().join('');
  
}
/*
///////////////////////////////////////////////////////////////////
//////////////  以下为rsa算法
//////////////
///////////////////////////////////////////////////////////////////
*/


// 扩展欧几里的算法
// 计算 ax + by = 1中的x与y的整数解（a与b互质）
function ext_gcd(a, b){
    if (b.toString() == "0"){
      return [a, new BigInt("1"), new BigInt("0")];
    }
    else{
      var next = ext_gcd(b, bigint_mod(a, b));
      r = next[0];
      x1 = next[1];
      y1 = next[2];
      x = y1
      
      di = bigint_div(a, b);
      if (di == undefined) {
        di = new BigInt("0")
      }
      mu = bigint_mul(di, y1);
      y = sub_plus(x1, mu)
      return [r, x, y]
    }
}

function multi(array, bin_array, n){
    var result = new BigInt("1");
    for (var index = 0; index < array.length-1; index++) {
        var a = array[index];
        if (Number(bin_array[index]) == 0){
            continue;
        }
        result = bigint_mul(result, a);
        result = bigint_mod(result, n);
    }
    return result;
}

// 超大整数超大次幂然后对超大的整数取模
// (base ^ exponent) mod n

function exp_mode(base, exponent, n){
    var bin_array = toBin(exponent.toString()).split('').reverse();
    r = bin_array.length;
    base_array = [];
    pre_base = base;
    base_array.push(pre_base);
    for (var i = 0; i < r; i++) {
        next_base = bigint_mod(bigint_mul(pre_base, pre_base), n);
        base_array.push(next_base);
        pre_base = next_base;
    }
    var a_w_b = multi(base_array, bin_array, n);
    return bigint_mod(a_w_b, n);
}

// 生产公钥与私钥的步骤，一共有5个步骤
// 1. 入参：选取p、q为两个超大质数
// 2、令n = p * q。取 φ(n) = (p-1) * (q-1)。
// 3、取 e ∈ [1 < e < φ(n) ] ，( n , e )作为公钥对，正式环境中取65537。
// 4、计算ed与fy的模反元素d。令 ed mod φ(n)  = 1，计算d，( n , d ) 作为私钥对。
// 5、销毁 p、q。生成公钥私钥
// 返回：   公钥     私钥     
var get_key = (p, q)=>{
    var n = bigint_mul(p, q)
    var t1 = new BigInt("1"); 
    var t0 = new BigInt("0");          
    var fy = bigint_mul(sub_plus(p, t1), sub_plus(q, t1)) 
    var e = new BigInt("65537");                    
    var a = e
    var b = fy
    var g = ext_gcd(a, b)
    // var r = g[0]
    var x = g[1]
    // var y = g[2]
    if (bigint_cmp(x, t0) < 0){
        x = add_plus(x, fy);
    }
    d = x 
    return [[n, e], [n, d]]  
}

// 加密 m是被加密的信息 加密成为c
// 密文 = 明文 ^ e mod n
var encrypt = (m, pubkey)=>{
    var re = []
    var n = pubkey[0]
    var e = pubkey[1]
    for (var i = 0; i < m.length; i++) {
        // 保护"0"首字符
        var t = new BigInt('1' + m[i]);
        var c = exp_mode(t, e, n)
        re.push(c.toString())
    }
    return re;
}

// 解密 c是密文，解密为明文m
// 明文 = 密文 ^ d mod n
var decrypt = (c, selfkey) =>{
    var re = []
    var n = selfkey[0]
    var d = selfkey[1]
    for (var i = 0; i < c.length; i++) {
        var t = new BigInt(c[i])
        m = exp_mode(t, d, n)
        re.push(m.toString())
    }
    return re;
}

// 将输入的字符串转为assic码字符串数组
var ToAssic = function(s, len){
    var re = [];
    var temp = "";
    for (var i = 0; i < s.length; i++) {
        if (temp.length >= len-3) {
        re.push(temp);
        temp = "";
        }
        var str = s.charAt(i);
        var code = str.charCodeAt();
        if (code > 99) {
        temp += ('0' + code)
        }
        else {
        temp += code;
        }
    }
    re.push(temp);
    return re;
}

// 将assic字符串数组翻译为原字符串内容
var FromAssic = function(s){
    var re = "";
    for (var i = 0; i < s.length; i++){
        // 去掉护“0”首位
        var cur = s[i].substr(1);
        for (var j = 0; j < cur.length;) {
            if (cur[j] != '0') {
                var tmp = Number(cur.substr(j,2));
                var str = String.fromCharCode(tmp);
                re += str;
                j += 2;
                continue;
            }
            else {
                var tmp = Number(cur.substr(j+1,3));
                var str = String.fromCharCode(tmp);
                re += str;
                j += 4;
            }
        }
    }
    return re;
}

exports.BigInt = BigInt;
exports.get_key = get_key;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.ToAssic = ToAssic;
exports.FromAssic = FromAssic;