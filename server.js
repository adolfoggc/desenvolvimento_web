/*
 * Exemplo para a prática 05
 * - uso de layouts
 * - uso de cookies  
 */

const express = require('express'); 
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts'); 
const app = express() 
const fs = require("fs");
const path = require('path');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

/*
 * Configuracap do uso do express-ejs-layouts na nossa aplicação
 * Ver layout.ejs no diretorio views
 */
app.use(expressLayouts) 

/* 
 * Configuração do uso do middleware de cookies
 */
app.use(cookieParser());




//funções
function titulo_aleatorio(){
	titulos = ['Dovahkiin', 'Peixe-boi', 'Cavaleiro de Cisne', 'Gyarados', 'Polenta', 'Tiamat', 'Ermenegildo', 'Tripanossoma Cruzi', 'Lazytown', 'Pepe Le Peau']
	return rand = titulos[Math.floor(Math.random() * titulos.length)];
}

function criar_arquivo(nome, conteudo){
	fs.writeFile(nome, conteudo, function (err) {
  	if (err) throw err;
  	frase = 'Arquivo Criado, '+ titulo_aleatorio();
  	console.log(frase);
	});  
}

function inserir_no_arquivo(nome, conteudo){
	fs.appendFile(nome, conteudo, function (err) {
	  if (err) throw err;
	  console.log('Çoca, çoca, çoca! Eu gosto de paçoca!');
	});  
}

function acrescentar_nova_receita(numero, novos_dados){
	arquivo = 'public/data/recipes.json';
	fs.readFile(arquivo, (err, dados) => {
	  if (err) {
	    console.error(err)
	    return
	  }
	  dados = dados.toString();
	  if(dados.length == 0){
	  	//inserir vírgula para novo elemento
	  	dados = "{\n";
	  } 
	  else if(dados.length > 0){
	  	dados = dados.substring(0,dados.length -1);
	  	dados = dados+",\n";
	  	//inserir vírgula para novo elemento
	  }

	  //formatar dados
	  novos_dados = dados+'"'+numero+'":["'+novos_dados+'"]\n}';
	  criar_arquivo(arquivo, novos_dados);

	});
}

//coisas sérias

app.get('/', (req, res) => {


	var pasta_receitas = path.join(__dirname+'/public/data')
	//contagem de arquivos na pasta
	fs.readdir(pasta_receitas, (err, files) => {
		counted_recipes = files.length;
		receitas = new  Array();
		
		files.forEach(file => {
			var filename = path.basename(file, '.json');
    	receitas.push(filename);
  	});
  	var dadosReceitas = new Array; 
		var count_receita = 0;

		
			
		// Carrega cookie
		var ultimaReceita = req.cookies.ultimaReceita;

		// Visualizacao de conteudo do cookie
		if (ultimaReceita != undefined) {
			console.log('Receita nº: ' + ultimaReceita +'\n');
		} else {
			console.log('Receita: vazia!!!\n');
			ultimaReceita = 0;
		}


		// Carrega cookies de preferências
		var style = req.cookies.style;
		var size = req.cookies.size;
		// Visualizacao de conteudo do cookie
		if (style != undefined) {
			console.log('Estilo: '+ style +'\n');
		} else {
			console.log('Sem Estilo\n');
			style = "style_1";
		}
		if (size != undefined) {
			console.log('Tamanho: '+ size+'\n');
		} else {
			console.log('Sem Tamanho\n');
			size = 2;
		}
		alvo = "public/data/recipes.json";
		dadosReceitas = new Array();
		fs.readFile(alvo, function(err, info) {
			if (err) throw err;
  		for(var rec_count = 0; rec_count < dadosReceitas; rec_count){
  			dadosReceitas.push(info[rec_count][0],info[rec_count][1]);	
  		}
  		console.log(dadosReceitas);
			res.render('index', { style, size, counted_recipes, ultimaReceita, receitas, dadosReceitas});
		});
	}); //fim readdir
});	

///////////////////////////////////////////

app.get('/cv', function(req,res) {
// app.post('/cv', function(req,res) {  // Substituir para o caso de usar POST
	var arr1 = [], arr2 = [];
	/*
	* Alternativa de recuperação de dados com o POST 
	* (nesse caso, os dados do formulário devem ser recuperados no payload do HTTP)
	* O comentário abaixo deve ser removidos e a linha subsequente comentada
	* para recuperar o nome no corpo o nome do usuário     
	*/
	// var name = req.body.name; // recuperação com POST
	var name = req.query.name; // recuperação com GET
	
	var diret = path.join(__dirname+'/public/data/'+name);
	
	var dadosCV = 
	{ 
	  userName : name,
	  linesSec1 : [], 
      	  linesSec2 : []
	}	

	// Leitura dos dados da 1a secao	// var name = req.params.usu //recuperação com /cv/:usu

	fs.readFile(diret+'/s1.txt', 
	    function (err, data) {
		if (err) {
			res.send('erro na leitura do aquivo s1.txt');
			return console.error(err);
		}
		dadosCV.linesSec1 = data.toString().split("\n")
	
		// Leitura dos dados da 2a secao
		fs.readFile(diret+'/s2.txt', 
	    function (err, data) {
			if (err) {
				res.send('erro na leitura do aquivo s1.txt');
				return console.error(err);
			}
			dadosCV.linesSec2 = data.toString().split("\n")
			
			// Salva cookie com nome de cv acessado
			res.cookie('lastCv', name);

			// executa cv.ejs
			res.render('cv2',dadosCV);
		});
	});
})

app.get('/receita/:rec', function(req,res) {
	var diret; 
	diret = path.join(__dirname+'/public/data/'+req.params.rec);	
	fs.readFile(diret+'.json', function (err, data) {
		if (err) {
			res.send('Dados inexistentes ou incompletos para '+req.params.rec);
			return console.error(err);
		}  
		dadosReceita = require(diret+'.json');

		res.render('recipes', {style, size, dadosReceita});
	});
});

app.get('/contato', (req, res) => {
    res.render('contato', {style, size})
})

app.get('/config', (req, res) => {
	// Carrega cookie
	var style = req.cookies.style;
	var size = req.cookies.size;
	// Visualizacao de conteudo do cookie
	if (style != undefined) {
		console.log('Estilo: '+ style +'\n');
	} else {
		console.log('Sem Estilo\n');
		style = "style_1";
	}
	if (size != undefined) {
		console.log('Tamanho: '+ size+'\n');
	} else {
		console.log('Sem Tamanho\n');
		size = 2;
	}

  res.render('config', {style, size})
})

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})
