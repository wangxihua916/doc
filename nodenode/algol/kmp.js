/**
 *kmp算法实现（nodejs版）
 *可以用来实现字符串的indexOf算法。但是官方库却不用这个算法实现字符串的indexOf。
 *比如java的String，宁愿用暴力匹配的方式。因为作者认为，通常用indexOf的场景，字符串都不大，
 *不用担心性能问题。他是对的，我们通常都不用关心indexOf的性能，如果真的有大文本查找，自己实现一个kmp就可以了。
 */
/***
 * 关键是理解next数组，该函数计算next数组。
 * next数组，可以理解为content[i]和word[j]匹配失败之后，接下来word应该用哪个位置的字符去进行匹配，
 * 也就是word在匹配失败后应该往右移多少位继续匹配。
 * 要计算next，要先计算word的各个子串S(0,j)的最长相同真前缀和真后缀。
 * 其中j>=1并且j<=word.length。
 * 比如word='abcdabc'的最长相同真前缀和真后缀为'abc'。
 * 并且这里用到递推的思想，设x0x1x2x3...xj的最长相同真前缀和真后缀为S(0,k)
 * 即从第0到第k个字符， 
 * 
 * 则x0x1x2x3...xkxk+1...xjxj+1的最长相同真前缀和真后缀为
 * S(0,k+1)如果xk+1==xj+1
 * 
 * 
 * word    ='abcdabe'
 * s     a    ab   abc  abcd abcda abcdab abcdabe
 * i     0     1    2    3     4     5      6
 * len   0     0    0    0     1     2      0
 * next  -1    0    0    0     1     2      0
 * 
 * 
 */
function calcNext(word){
	let k = -1;//计算word[0:j]的next值时，从哪个位置开始匹配word[j]。
	let next = [-1];//如果匹配失败，则content当前字符和word的哪个位置的字符匹配。
	for(let j=1;j<word.length;j++){
		while(k>-1 && word[k+1]!=word[j]){
			k = next[k];
		}
		if(word[k+1]==word[j]){
			k = k+1;
		}
		next[j] = k;
	}
	return next;
}
function Matcher(word){
	let next = calcNext(word);
	return {
		match(content){//返回单词首次匹配成功时第一个字符在content中的下标
			let i = 0;//当前匹配的content的字符的下标
			let j = 0;//当前匹配的单词的字符的下标
			while(i<content.length&&j<word.length){
				if(j==-1||content[i]==word[j]){//如果匹配，则匹配下一个字符
					i=i+1;
					j=j+1;
				}else{//如果不匹配，对word从next[j]开始匹配
					j = next[j];
				}
			}
			if(j==word.length){//匹配成功
				return i-word.length;
			}
			return -1;//匹配失败，返回-1，表示没content中找到这个单词
		},
		next(){
			return next;
		}
	};
}
function test(){
	let word = 'opo';
	let matcher = Matcher(word);
	let content = 'hello avril lavigne,opopopo';
	let res = matcher.match(content);
	console.info(res);
	console.info(content.substring(res));
	console.info(JSON.stringify(matcher.next()));
}
test();
module.exports = {
		Matcher
};