var SessaoManha = function(palestras) {
    this.palestras=palestras;
    this.inicio=9;
    fim={12:"almoço"};
};
var SessaoTarde = function(palestras){
    this.palestras=palestras;
    this.inicio=13;
    fim={17:"Networking"}

};
var Track = function(nome, SessaoManha, SessaoTarde) {
    this.nome = nome;
    this.SessaoManha = SessaoManha;
    this.SessaoTarde = SessaoTarde;

};
var Palestra = function(nome, duracao, descricao) {
    this.nome = nome;
    this.duracao = duracao;
    this.descricao = descricao;
};
function semNumeros(nome){
    var array=['0','1','2','3','4','5','6','7','8','9']
    for (let index = 0; index< array.length; index++) {
        if (nome.includes(array[index])){
            return false;
        }
    }return true;
}
function criarPalestra(nome, duracao, descricao)
{   if (nome == ""){
    return undefined
    }
    if (typeof duracao == "number"){
        if (semNumeros(nome)){
            var palestra = new Palestra(nome, duracao, descricao);
            return palestra;
        }
    }return undefined;
}
function nomearTrack(index){
    alfabeto="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return "Track " + alfabeto[index] + ":";
};
function criarTrack(nome){
    palestras=limparArray(palestras);
    var sessaoManha = criarSessaoManha();
    palestras=limparArray(palestras);
    var sessaoTarde = criarSessaoTarde();
    var track = new Track(nome, sessaoManha, sessaoTarde);
    return track;
};
function criarSessaoManha(){
    var mPalestras=[];
    const limite=180;
    var peso=0;
    for (let index = 0; index < palestras.length; index++) {
        if(palestras[index].duracao + peso <= limite){
            var e= palestras[index];
            mPalestras.push(e);
            peso=peso+palestras[index].duracao;
            delete palestras[index];
        };
        if(peso == limite){
            var sessaoManha = new SessaoManha(mPalestras);
            return sessaoManha;
        }
    }var sessaoManha = new SessaoManha(mPalestras);
    return sessaoManha;
};
function criarSessaoTarde(){
    const limite=240;
    var peso=0;
    var mPalestras=[];
    for (let index = 0; index < palestras.length; index++) {
        if(palestras[index].duracao + peso <= limite){
            var e= palestras[index];
            mPalestras.push(e);
            peso=peso+palestras[index].duracao;
            delete palestras[index];
        };
        if(peso == limite){
            var sessaoTarde = new SessaoTarde(mPalestras);
            return sessaoTarde;
        }
    }var sessaoTarde = new SessaoTarde(mPalestras);
    return sessaoTarde;
};
function criarTracks(){
    if(palestras.length==0){
        return undefined;
    }
    var tracks=[];
    var nomeTrack=nomearTrack(tracks.length);
    while (palestras.length>0) {
        nomeTrack=nomearTrack(tracks.length);
        var track = criarTrack(nomeTrack, palestras);
        tracks.push(track);
        palestras = limparArray(palestras);
    }
    return tracks;

}
function tratarDuracao(elemento){
    var duracao;
    elemento = elemento.replace("\r","")
    if (elemento=="lightning"){
        duracao = 5;
    }else{
        duracao = elemento;
        duracao = duracao.replace("min","");
    }
    duracao = parseInt(duracao,10)
    return duracao;
};
function limparArray(palestras){
    var p = [];
    for (let index = 0; index < palestras.length; index++) {
        if(!(typeof palestras[index] == "undefined")){
            p.push(palestras[index]);
        }
    }
    return p;
}
function nomearTrack(index){
    alfabeto="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var resposta = "Track " + alfabeto[index] +":\n";
    return resposta;
};

function trackToString(track){
    var resposta = track.nome + sessaoToString(track.SessaoManha)+"12:00 Almoço\n"+ sessaoToString(track.SessaoTarde)+"17:00 Networking\n";
    return resposta;
};
function sessaoToString(sessao){
    var resposta = "";
    var data=new Date();
    data.setHours(sessao.inicio,00);
    for (let index = 0; index < sessao.palestras.length; index++) {
        var resultado = data.getHours() + ":" + (min = (data.getMinutes() < 10) ? '0' : '') + data.getMinutes();
        resposta += resultado + " " + sessao.palestras[index].descricao +"\n";  
        date =data.setHours(data.getHours(),data.getMinutes()+sessao.palestras[index].duracao);   
    }
    return resposta;  
}

var fs = require('fs');
var textByLine = fs.readFileSync('proposals.txt').toString().split("\n");
var element;
var palestras=[];
for (let index = 0; index < textByLine.length; index++) {
    element = textByLine[index].split(" ");
    var nome = element.slice(0,element.length - 1).join(" ").replace("\r","");
    var descricao = element.join(" ").replace("\r","");
    var duracao =  tratarDuracao(element[element.length-1]);
    var p1 = criarPalestra(nome, duracao, descricao);
    if(!(p1==undefined)){
        palestras.push(p1);
    }

}
var resposta = "";
var tracks = criarTracks();
for (let index = 0; index < tracks.length; index++) {
    const element = tracks[index];
    resposta = resposta + trackToString(element);    
}

fs.writeFile("resposta.txt", resposta, function(erro) {
    if(erro) {
        throw erro;
    }
});
