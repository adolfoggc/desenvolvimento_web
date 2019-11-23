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
const multer = require('multer');

//#AT8
const session = require('express-session')
const crypto = require('crypto');
const secret = 'A1B120dkOplcm4lH'

var sha512 = (pwd, salt) => {
	var hash = crypto.createHmac('sha512', salt)
	hash.update(pwd);
	return hash.digest('hex');
}

//FIM #AT8


app.use(express.static('public'));
app.set('view engine', 'ejs');

// #AT8
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//FIM #AT8

/*
 * Configuracap do uso do express-ejs-layouts na nossa aplicação
 * Ver layout.ejs no diretorio views
 */
app.use(expressLayouts) 

/* 
 * Configuração do uso do middleware de cookies
 */
app.use(cookieParser());

//contador de arquivos

var maxSize = 500*1024; // 500kb

const storage = multer.diskStorage({
    // destino do arquivo
    destination: function (req, file, cb) {
        cb(null, 'public/receitas/'+req.params.rec);
    },
    // nome do arquivo
    filename: function (req, file, cb) {
        cb(null, 'receita.jpg');
    }
});

const atualizar_arquivos = fs => new Promisse((resolve, reject) => {
	var pasta_receitas = path.join(__dirname+'/public/receitas');
	var proxima_id_receita = 0;
	fs.readdir(pasta_receitas, (err, files) => {
		counted_recipes = files.length;
		
		//receberá ids válidas de receitas
		var receitas = new Array();
		// receitas = contar_pastas(fs, __dirname+'/public/receitas');

		files.forEach(file => {
			var filename = path.basename(file, '.json');
    	if(parseInt(filename) > proxima_id_receita){

    		proxima_id_receita = parseInt(filename);
    	}
  	});
  	proxima_id_receita++;
  	console.log("==============================");
  	console.log("Receitas Ativas: "+counted_recipes);
  	console.log("Receitas Inativas: "+"0");
  	console.log("Próxima Id de Receita: "+proxima_id_receita);
  	console.log("==============================");
  	resolve(proxima_id_receita);
	});
});

//promisses?
/*
let update_file(caminho_arquivo, dados, res) = new Promise((resolve, reject) => {
	if(){
		resolve("Deu bom");
	} else {
		reject(Error("Deu ruim"));
	}
}); */
/*
let update_file = function(caminho_arquivo, dados, res) {
  return new Promise(function(resolve, reject) {
    /*stuff using username, password
    if (  ) {
      resolve("Stuff worked!");
    } else {
      reject(Error("It broke"));
    }
  });
} */

//uploader
const upload = multer({
    storage : storage,
    limits  : { fileSize: maxSize }
}).single('file');

//funções
function titulo_aleatorio(){
	titulos = ['Dovahkiin', 'Peixe-boi', 'Cavaleiro de Cisne', 'Gyarados', 'Polenta', 'Tiamat', 'Ermenegildo', 'Tripanossoma Cruzi', 'Lazytown', 'Pepe Le Peau']
	return rand = titulos[Math.floor(Math.random() * titulos.length)];
}

function criar_arquivo(nome, conteudo, fs){
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

function checagem_cookie(cookie, nome_cookie, valor_padrao){
	valor = cookie;
	if (valor != undefined) {
		//console.log('Valor em '+nome_cookie+': '+ valor +'\n');
	} else {
		//console.log('Cookie Vazio: '+valor_padrao+'\n');
		valor = valor_padrao;
	}
	return valor;
}

function copia_para_outra_pasta( arquivo, antigo_endereco,novo_endereco, fs, extensao ){
	try {
		fs.copyFile(antigo_endereco+"/"+arquivo+'.'+extensao, novo_endereco+"/"+arquivo+'.'+extensao, (err) => {
		  if (err){ 
		  	//console.log(err);
		  }
		});	
	} catch(error){

	}
}


function backup_arquivo( arquivo, endereco, fs, extensao ){
	fs.copyFile(endereco+"/"+arquivo+'.'+extensao, endereco+"/backup_"+arquivo+'.'+extensao, (err) => {
	  if (err){ 
	  	throw err;
	  	console.log(err);
	  }
	});	
}

function rollback( arquivo, endereco, fs, extensao ){
	fs.copyFile(endereco+"/backup_"+arquivo+'.'+extensao, endereco+"/"+arquivo+'.'+extensao, (err) => {
	  if (err){ 
	  	throw err;
	  	console.log(err);
	  }
	  console.log("rollback!");
	});	
}

function contar_pastas(fs,direct){
	//conta e recebe nome
	var pastas = new Array();
	fs.readdir(direct, (err, files) => {
	  files.forEach(file => {
	    pastas.push(file);
	  });
	  return pastas;
	});
}

//OPCAO

  function cleanEmptyFoldersRecursively(folder) {
    var fs = require('fs');
    var path = require('path');
    console.log(folder);
    var isDir = fs.statSync(folder).isDirectory();
    if (!isDir) {
      return;
    }
    var files = fs.readdirSync(folder);
    if (files.length > 0) {
      files.forEach(function(file) {
        var fullPath = path.join(folder, file);
      	fs.unlinkSync(fullPath);  
        cleanEmptyFoldersRecursively(fullPath);
      });

      // re-evaluate files; after deleting subfolder
      // we may have parent folder empty now
      files = fs.readdirSync(folder);
    }

    if (files.length == 0) {
      console.log("removing: ", folder);
      fs.rmdirSync(folder);
      return;
    }
  }

function apagar_arquivos(caminho,fs, arquivos) {
	let apagados = 0;
	for(var count = 0; count < arquivos.length; count++){
		arquivo = caminho+"/"+arquivos[count];
		console.log(arquivo);
		try {
			fs.unlinkSync(arquivo);
			apagados++;
		} catch(err){
			//segue o baile
			//console.log(err)
		}		
	}
	console.log(apagados+" arquivos apagados");
}

//coisas sérias

app.get('/', (req, res) => {
	//path de arquivos de receitas
	var pasta_receitas = path.join(__dirname+'/public/receitas')
	//contagem de arquivos na pasta
	fs.readdir(pasta_receitas, (err, files) => {
		counted_recipes = files.length;
		
		//receberá ids válidas de receitas
		var receitas = new Array();
		// receitas = contar_pastas(fs, __dirname+'/public/receitas');

		files.forEach(file => {
			var filename = path.basename(file, '.json');
    	receitas.push(filename);
  	});
  	var dadosReceitas = new Array; 
		var count_receita = 0;
		//console.log("Valor em receitas: "+receitas);	

		// Carrega receita
		var ultimaReceita = checagem_cookie(req.cookies.ultimaReceita, "ultimaReceita", 0);

		// Carrega cookies de preferências (cookie, nome, valor padrão)
		var style = checagem_cookie(req.cookies.style, "Estilo", "style_1");
		var size = checagem_cookie(req.cookies.size, "Tamanho", 2);

		

		diret = path.join(__dirname+'/public/data/recipe_names.json');
		nomesReceitas = new Array();
		
		

		//modelo anterior
		fs.readFile(diret, function (err, dadosReceitas) {
			if (err) {
				//res.send('Dados inexistentes ou incompletos para '+req.params.rec);
				return console.error(err);
			}  
			//dadosReceitas = require(diret);
			//dadosReceitas = inside_data;
			dadosReceitas = JSON.parse(dadosReceitas);
			console.log("===============================");
			console.log(dadosReceitas);
			console.log("===============================");
			console.log("Receitas em Pastas: "+counted_recipes);
			console.log("Receitas no json: "+Object.keys(dadosReceitas).length);
			console.log("===============================");
			step = undefined;
			res.render('index', { style, size, counted_recipes, ultimaReceita, receitas, step, dadosReceitas});		
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

	// Carrega cookies de preferências (cookie, nome, valor padrão)
	var style = checagem_cookie(req.cookies.style, "Estilo", "style_1");
	var size = checagem_cookie(req.cookies.size, "Tamanho", 2);
	var diret; 
	diret = path.join(__dirname+'/public/receitas/'+req.params.rec);	
	fs.readFile(diret+'/receita.json', function (err, data) {
		if (err) {
			res.send('Dados inexistentes ou incompletos para '+req.params.rec);
			return console.error(err);
		}  
		dadosReceita = require(diret+'/receita.json');
		step = 2;
		//var ultimaReceita = checagem_cookie(req.cookies.ultimaReceita, "Receita", 0);
		//res.cookie('lastCv', :rec);
		var recipe_id = req.params.rec;
		//res.cookie('ultimaReceita', req.params.rec, { maxAge: 9000, httpOnly: true });
		res.render('recipes', {style, size, dadosReceita, step, recipe_id});
	});
});

app.get('/receita/edit/:rec', function(req,res) {
	// Carrega cookies de preferências (cookie, nome, valor padrão)
	var style = checagem_cookie(req.cookies.style, "Estilo", "style_1");
	var size = checagem_cookie(req.cookies.size, "Tamanho", 2);
	var diret; 
	diret = path.join(__dirname+'/public/receitas/'+req.params.rec);	
	fs.readFile(diret+'/receita.json', function (err, data) {
		if (err) {
			res.send('Dados inexistentes ou incompletos para '+req.params.rec);
			return console.error(err);
		}  
		dadosReceita = require(diret+'/receita.json');
		step = 2;
		//var ultimaReceita = checagem_cookie(req.cookies.ultimaReceita, "Receita", 0);
		//res.cookie('lastCv', :rec);
		var recipe_id = req.params.rec;
		//res.cookie('ultimaReceita', req.params.rec, { maxAge: 9000, httpOnly: true });
		res.render('edit_recipes', {style, size, dadosReceita, step, recipe_id});
	});
});


//ATIVIDADE 7
app.post('/create', function(req,res) {
	var style = checagem_cookie(req.cookies.style, "Estilo", "style_1");
	var size = checagem_cookie(req.cookies.size, "Tamanho", 2);
	step = 2;
	//console.log(proxima_id_receita);
	//criando nova pasta
	var pasta_receitas = path.join(__dirname+'/public/receitas');
	var proxima_id_receita = 0;
	//obter próxima id	
	fs.readdir(pasta_receitas, (err, files) => {
		files.forEach(file => {
			var filename = path.basename(file, '.json');
    	if(parseInt(filename) > proxima_id_receita){

    		proxima_id_receita = parseInt(filename);
    	}
  	});
  	proxima_id_receita++;
  	const nova_id = proxima_id_receita;
  	pasta_receitas = path.join(__dirname+'/public/receitas/'+nova_id);

		if (!fs.existsSync(pasta_receitas)){
	  	fs.mkdirSync(pasta_receitas);
		}
		//trabalhando o upload
		
		//backup sem arquivo original?
		//backup_arquivo("receita",direct,fs, "jpg");
		req.params.rec = nova_id;
	  upload(req, res, function (err) {
	    if (err) {
	        res.send('<h1>Tururu...</h1>');
	        //rollback("receita",direct,fs, "jpg");
	        return console.log(err);
	    }
	   	var dadosReceita = {}; //novo json	
			
			dadosReceita["nome_receita"] = req.body.nome_receita;
	    dadosReceita["descricao"] = req.body.descricao.replace('\t','');
	    dadosReceita["preparo"] = req.body.preparo.replace('\t','');
	    dadosReceita["ingredientes"] = req.body.ingredientes.replace('\t','');
	    dadosReceita["receita_categoria"] = req.body.categoria_receita;
	    dadosReceita["receita_tempo"] = req.body.tempo_receita;
	    dadosReceita["receita_quantidade"] = req.body.quantidade_receita;
	    dadosReceita["receita_original"] = req.body.receita_original;
			
	    //criando arquivo
	    fs.writeFile(pasta_receitas + '/receita.json', JSON.stringify(dadosReceita), function (err, data){
	      if (err) {
	        console.log('Erro gravando atualizações');
	        return console.error(err);
	      }
	      //atualizar arquivo inicial
	      let caminho_indice = path.join(__dirname + '/public/data/recipe_names.json');
	      fs.readFile(caminho_indice, function (err, data) {
					if (err) {
						res.send('Dados inexistentes ou incompletos para arquivo de índice');
						return console.error(err);
					}
					//capturando arquivo anterior
	    		arquivo_indice = require(caminho_indice);
	    		//inserindo novos campos
	    		nome_receita = dadosReceita["nome_receita"];
	    		
	    		console.log("=================================================");
	    		console.log("Dados a inserir: "+nome_receita+ " e "+5);
	    		console.log("=================================================");
	    		str = JSON.stringify(arquivo_indice);
	    		arquivo_indice = str.substring(0,str.length-1);
	    		arquivo_indice += ',"'+nova_id+'":["'+nome_receita+'","'+5+'"]}';
	    		//atualizando arquivo de índice
	    		console.log("=================================================");
	    		console.log(arquivo_indice);
	    		arquivo_indice = JSON.parse(arquivo_indice);
	    		fs.writeFile(caminho_indice, JSON.stringify(arquivo_indice), function (err, data){
		        if (err) {
		          console.log('Erro gravando atualizações');
		          return console.error(err);
		        }else {
			        console.log("gravação completa!")
			        //deu bom
							res.redirect('/');
						}
					});	
	      });
			}); 
	  });//fim upload
  });
	///
});//fim create

app.get('/nova_receita', function(req,res) {
	var style = checagem_cookie(req.cookies.style, "Estilo", "style_1");
	var size = checagem_cookie(req.cookies.size, "Tamanho", 2);
	step = 2;

	var dadosReceita = {"nome_receita":"Digite o Nome da Receita","descricao":"Faça uma apresentação de sua receita","ingredientes":"Liste os ingredientes\nSeparar cada um com um ENTER", "preparo" : "Liste os Passos do preparo\nSeparar cada um com um ENTER","receita":["Massas","10","1"],"receita_original":"Coloque o link de onde veio a receita original","avaliacoes":[["Muito bom!","1","Coxinha","#"]],"restaurantes":[["Toca da Catita","#","#","0"]],"receitas_semelhantes":[["5","Nuggets de Carne de Porco"],["2","Macarronada de Macarrão"],["6","Churrasco do Desejo Canino"]],"op":"Físico Turista","receita_categoria":"Bebidas","receita_tempo":"1","receita_quantidade":"1"}
	recipe_id = 1;
	res.render('nova', {style, size, step, dadosReceita, recipe_id});
});//fim new


app.get('/apagar/:rec', function(req,res) {
	var pasta_receitas = path.join(__dirname+'/public/receitas/'+req.params.rec);
	var pasta_lixeira = path.join(__dirname+'/public/lixeira/'+req.params.rec);

	//criar pasta na lixeira
	if (!fs.existsSync(pasta_lixeira)){
	  fs.mkdirSync(pasta_lixeira);
	}

	//copiando arquivos
	copia_para_outra_pasta( "avatar", pasta_receitas, pasta_lixeira, fs, "jpeg" )
	copia_para_outra_pasta( "receita", pasta_receitas, pasta_lixeira, fs, "jpg" )
	copia_para_outra_pasta( "receita", pasta_receitas, pasta_lixeira, fs, "json" )
	
	//checando cookie
	if(req.cookies.ultimaReceita == req.params.rec){
		console.log("uepa!");
		res.clearCookie("ultimaReceita");
	}
	let arquivos = ["avatar.jpeg", "receita.jpg", "receita.json", "backup_receita.jpg"];
	apagar_arquivos(pasta_receitas, fs, arquivos);
	fs.rmdirSync(pasta_receitas);
	//cleanEmptyFoldersRecursively(pasta_receitas);

	//var ultimaReceita = checagem_cookie(req.cookies.ultimaReceita, "ultimaReceita", 0);
	res.redirect('/');
});
//FIM ATIVIDADE 7




app.get('/contato', (req, res) => {
		var style = checagem_cookie(req.cookies.style, "Estilo", "style_1");
		var size = checagem_cookie(req.cookies.size, "Tamanho", 2);
		step = undefined;
    res.render('contato', {style, size, style, size, step})
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
});

//EDIT
app.post('/receita/edit/update/:rec', function(req, res) {
  //chamando multer
  var direct = path.join(__dirname + '/public/receitas/'+req.params.rec);
  backup_arquivo("receita",direct,fs, "jpg");
  upload(req, res, function (err) {
    if (err) {
        res.send('<h1>Tururu...</h1>');
        rollback("receita",direct,fs, "jpg");
        return console.log(err);
    }
   
    fs.readFile(direct+'/receita.json', function (err, data) {
			if (err) {
				res.send('Dados inexistentes ou incompletos para '+req.params.rec);
				return console.error(err);
			}
			//json copiado  
			dadosReceita = require(direct+'/receita.json');
			
			//console.log(typeof(dadosReceita));
 		  dadosReceita.nome_receita = req.body.nome_receita;
      dadosReceita.descricao = req.body.descricao.replace('\t','');
      dadosReceita.preparo = req.body.preparo.replace('\t','');
      dadosReceita.ingredientes = req.body.ingredientes.replace('\t','');
      dadosReceita.receita_categoria = req.body.categoria_receita;
      dadosReceita.receita_tempo = req.body.tempo_receita;
      dadosReceita.receita_quantidade = req.body.quantidade_receita;
      dadosReceita.receita_original = req.body.receita_original;
			//console.log(dadosReceita);
      //criar_arquivo(direct + '/receita.json', dadosReceita,fs);
      fs.writeFile(direct + '/receita.json', JSON.stringify(dadosReceita), function (err, data){
        if (err) {
          console.log('Erro gravando atualizações');
          return console.error(err);
        }
        //atualizar arquivo inicial
        let caminho_indice = path.join(__dirname + '/public/data/recipe_names.json');
        fs.readFile(caminho_indice, function (err, data) {
					if (err) {
						res.send('Dados inexistentes ou incompletos para arquivo de índice');
						return console.error(err);
					}
      		arquivo_indice = require(caminho_indice);
      		arquivo_indice[req.params.rec][0] = req.body.nome_receita;
      		fs.writeFile(caminho_indice, JSON.stringify(arquivo_indice), function (err, data){
		        if (err) {
		          console.log('Erro gravando atualizações');
		          return console.error(err);
		        }	
  					res.redirect('/');
  				});
  			});	
      });
		}); 
  }); //upload
});


app.listen(8080, function () {
  console.log('Servidor iniciado na porta 8080!')
})
