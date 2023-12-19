/**
 * // công thức toán,hóa
!!![equation](text) // text la mathml
// hình ảnh
!!![image](url)
//video
!!![video](url)
// youtube
!!![video_youtube](url)
// audio
!!![audio](url)
 * @param {*} text
 */
// export function formatToHTML(text) {
//     text = text.replaceAll(/!!!\[equation\]\((.*?)\)/g, '$1')
//         .replaceAll(/!!!\[image\]\((.*?)\)/g, `<img src="$1" style="display:block" />`)
//         .replaceAll(/!!!\[video\]\((.*?)\)/g, `<video controls src="$1" style="display:block" />`)
//         .replaceAll(/!!!\[video_youtube\]\((.*?)\)/g, `<iframe width="560" height="315" src="$1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`)
//         .replaceAll(/!!!\[audio\]\((.*?)\)/g, `<audio controls src="$1" style="display:block" />`)
//     return text;
// }
function unescapeHTML(escapedHTML) {
    escapedHTML = escapedHTML.toString()
    return escapedHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

export function getBreakLineEquation(str = '') {
    const breakLine = '<mspace linebreak="newline"/>'
    const endLine = '</math>'
    if (str.indexOf(breakLine) < 0)
        return [str];
    const newText = str.replaceAll('<mspace linebreak="newline"/>', '</math><math xmlns="http://www.w3.org/1998/Math/MathML">');
    const arr = newText.split('</math>')
    let result = []
    for (let item of newText.split(endLine)) {
        item && result.push(`${item}${endLine}`)
    }
    return result;

}
export function getEquation(str, options = {}) {
    if (!str) return '';
    const text = unescapeHTML(str)
    const { imgStyle = 'margin: auto;display:block;width:33.33%' } = options;
    return text
        .replace(/\r\n/g, "@@@rn@@@")
        .replace(/>\n</g, `><mo linebreak="newline"></mo><`)
        // .replace(/\n/g, '<br />')
        .replace(/!!!\[equation\]\((.*?)\)!!!/g, "$1")
        .replace(/!!!\[image\]\((.*?)\)!!!/g, `<img src='$1' style=${imgStyle} />`)
        .replace(/!!!\[audio\]\((.*?)\)!!!/g, "<audio src='$1' style='width: 60%; min-width: 300px; margin-top: 1rem; margin: auto;display:block' controls='controls' ></audio>")
        .replace(/!!!\[video\]\((.*?)\)!!!/g, "<video src='$1' style='width: 60%; margin-top: 1rem; margin: auto;display:block' controls='controls' ></video>")
        .replace(/<span style="(.*?)>((.|\n)*?)<\/span>/g, "$2") // remove style css
        .replace(/!!!\[sub\]\((.*?)\)!!!/g, `<sub>$1</sub>`)
        .replace(/!!!\[sup\]\((.*?)\)!!!/g, `<sup>$1</sup>`)
        .replace(/<_image_>(.*?)(.PNG|.png|.jpg|.JPG)/g, "<img src='$1$2' style='max-width: 100%;'/>")
        .replace(/\\begin{tabular}(.*?)\\end{tabular}/g, a => a.replace(/\\\(/g, "").replace(/\\\)/g, ""))
        .replace(/\\begin{tabular}(.*?)\\end{tabular}/g, '\\[ \\begin{array}$1\\end{array} \\]').replace(/\\multicolumn{(1)}{(.*?)}(.*?){(.*?)}(.*?)\\\\/g, "$4").replace(/\\multicolumn{(.*?)}{(.*?)}(.*?){(.*?)}(.*?)\\\\/g, '')
        .replace(/MJX-TeXAtom-ORD/g, "")
        .replace(/@@@rn@@@/g, `\r\n`)
        .replace(/<figure(.*?)<\/figure>/g,a => a.replace(/<img/g,"<img style='width:100%'"))
        //Sửa lỗi khi sửa công thức xong tự động bị xuống dòng.
        // .replace(/&nbsp;/g,"<br>")
        .replace(/<img src/g,"<img style='max-width:100%' src")
        .replace(/[^src="||'](https:\/\/(.*?)(.PNG|.png|.jpg|.JPG))/g,"<img src=\"$1\" />")
        .replace(/<br</g,"<br/><")
        .replace(/<oembed url="(.*?)\/watch\?v=(.*?)"><\/oembed>/g, `<iframe width="560" height="315" src="$1/embed/$2" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`)
}

export function formatLatex(str) {
    console.log(`str`, str)
    if (!str) return '';
    const text = unescapeHTML(str);
    return text.replace(/\\/g, "\\\\")
}

export function convertSvgToLatx(str) {
    if (!str) return '';
    const text = unescapeHTML(str);
    return text.replace(/<div id="react-mathjax-preview" style="display: inline;"><div class="react-mathjax-preview-result">((.|\s)*?)<\/div><\/div>/g, "$1").replace(/<span class="MathJax_Preview" style="color: inherit; display: none;">(.*?)<script type="math\/tex" id="MathJax-Element(.*?)>/g, "$$$").replace(/\$\$(.*?)<\/script>/g, "\$ \$1 \$")
}

export function getTextSvg(str) {
    if (!str) return "";
    const text = unescapeHTML(str);
    return text.replace(/(.*?)<math xmlns="http:\/\/www.w3.org\/1998\/Math\/MathML">(.*?)<\/math><\/span>/g, '<math xmlns="http://www.w3.org/1998/Math/MathML">\$2</math>')
}

export function setEquation(str) {
    if (!str) return ''
    return str.replace(/<math(.*?)<\/math>/g, '!!![equation](<math$1</math>)!!!')
        .replace(/<img src="(.*?)"(.*?)\/>/g, '!!![image]($1)!!!')
        .replace(/<audio src="(.*?)"(.*?)\/>/g, '!!![audio]($1)!!!')
        .replace(/<video src="(.*?)"(.*?)\/>/g, '!!![video]($1)!!!')
}

export function contentHasMathML(str = '') {
    return str.indexOf('<math xmlns') >= 0
}

export function convertHtmlToMathml(str = '') {
    return str.replace(/<span class="MathJax_Preview" style="color: inherit; display: none;"><\/span><span class="MathJax" id="MathJax-Element(.*?)<span class=\"MJX_Assistive_MathML\" role=\"presentation\"><math xmlns="http:\/\/www.w3.org\/1998\/Math\/MathML">(.*?)<\/math><\/span>(.*?)<\/script>/g, "<math xmlns=\"http:\/\/www.w3.org\/1998\/Math\/MathML\">$2<\/math>")
        .replace(/<div style=\"width: 100%; text-align: left;\">(.*?)<\/div>/g, "$1")
        .replace(/<script type="math((.|\n)*)<\/script>/g, "")
        .replace(/<span class="MathJax" id="MathJax-Elemen(.*?)<\/span>/g, "")
        .replace(/<span class="MathJax_Preview"(.*?)<nobr(.*?)<\/nobr>/g, "")
        .replace(/<figure(.*?)<\/figure>/g,a => a.replace(/<img style=\"width:100%\"/g,"<img"))
        .replace(/<\/figure><br>/,"</figure>")
        .replace(/<iframe width="560" height="315" src="(.*?)\/embed\/(.*?)" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen><\/iframe>/g, `<oembed url="$1/watch?v=$2"></oembed>`)
}


// export function convertStringToDataEditor(str = '')_{
//     return str.replace(/<iframe width="560" height="315" src="(.*?)\/embed\/(.*?)" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen><\/iframe>/g, `<oembed url="$1/watch?v=$2"></oembed>`)
// }
