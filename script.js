// Definindo abreviações de códigos primários
const query = document.querySelector.bind(document);
const queryAll = document.querySelectorAll.bind(document);
const create = document.createElement.bind(document);

// Definindo variáveis globais
const botaoAdicaoTarefa = query('#criar-tarefa');
const botaoLimpaLista = query('#apaga-tudo');
const botaoRemoverFinalizados = query('#remover-finalizados');
const botaoSalvarTarefas = query('#salvar-tarefas');
const botaoMoverCima = query('#mover-cima');
const botaoMoverBaixo = query('#mover-baixo');
const botaoRemoverSelecionado = query('#remover-selecionado');
const inputTarefa = query('#texto-tarefa');
const listaDeTarefas = query('#lista-tarefas');

// Removendo item selecionado
function removerItemSelecionado() {
  const elementoSelecionado = query('#ligado');
  if (elementoSelecionado === null) return;
  listaDeTarefas.removeChild(elementoSelecionado);
}

botaoRemoverSelecionado.addEventListener('click', removerItemSelecionado);

// Movendo itens da lista
function moverElementoParaCima() {
  const elementoSelecionado = query('#ligado');
  if (elementoSelecionado === null) return;
  const elementoDeCima = elementoSelecionado.previousElementSibling;
  if (elementoDeCima !== null) listaDeTarefas.insertBefore(elementoSelecionado, elementoDeCima);
}

botaoMoverCima.addEventListener('click', moverElementoParaCima);

function moverElementoParaBaixo() {
  const elementoSelecionado = query('#ligado');
  if (elementoSelecionado === null) return;
  const elementoDeBaixo = elementoSelecionado.nextElementSibling;
  if (elementoDeBaixo !== null) {
    listaDeTarefas.insertBefore(elementoSelecionado, elementoDeBaixo.nextElementSibling);
  }
}

botaoMoverBaixo.addEventListener('click', moverElementoParaBaixo);

// Criando função de salvar as tarefas no Local Storage
function criarObjetoParaSalvar(elementoOrigem) {
  const objetoTarefas = {};
  for (let i = 0; i < elementoOrigem.length; i += 1) {
    const objetoInterno = {};
    objetoTarefas[`${i}`] = objetoInterno;
  }
  return objetoTarefas;
}

function salvarTarefas() {
  const elementosDaListaDeTarefas = listaDeTarefas.children;
  const objetoTarefas = criarObjetoParaSalvar(elementosDaListaDeTarefas);

  for (let i = 0; i < elementosDaListaDeTarefas.length; i += 1) {
    objetoTarefas[`${i}`].innerHTML = elementosDaListaDeTarefas[i].innerHTML;
    objetoTarefas[`${i}`].className = elementosDaListaDeTarefas[i].className;
    objetoTarefas[`${i}`].id = elementosDaListaDeTarefas[i].id;
  }

  localStorage.setItem('tarefas', JSON.stringify(objetoTarefas));
}

botaoSalvarTarefas.addEventListener('click', salvarTarefas);

// Criando ação do botao de remover finalizados
function removerFinalizados() {
  const elementosFinalizados = queryAll('.completed');

  for (let i = 0; i < elementosFinalizados.length; i += 1) {
    listaDeTarefas.removeChild(elementosFinalizados[i]);
  }
}

botaoRemoverFinalizados.addEventListener('click', removerFinalizados);

// Criando ação do botão de limpar a lista
function apagarLista() {
  if (listaDeTarefas.innerHTML !== '') {
    listaDeTarefas.innerHTML = '';
  }
}

botaoLimpaLista.addEventListener('click', apagarLista);

// Criado a ação de riscar um elemento da lista
function riscarEDesriscarElementoDaLista(evento) {
  const elemento = evento.target;
  elemento.classList.toggle('completed');
}

// Adicionando a cor ao clicar no item da lista
function removerIdLigadoDoElemento() {
  const elementoComIdLigado = query('#ligado');
  if (elementoComIdLigado === null) return;
  elementoComIdLigado.id = 'naoLigado';
}

function colorirFundoDoItemDaListaAoClicar(evento) {
  const origem = evento.target;
  if (origem.id === 'naoLigado') {
    removerIdLigadoDoElemento();
    origem.id = 'ligado';
  }
}

// Carregando itens do LocalStorage
function colocarItensDoLocalStorage() {
  const tarefasDoLocal = JSON.parse(localStorage.getItem('tarefas'));

  for (let i = 0; i < Object.keys(tarefasDoLocal).length; i += 1) {
    const itemDaLista = create('li');
    itemDaLista.innerHTML = tarefasDoLocal[i].innerHTML;
    itemDaLista.className = tarefasDoLocal[i].className;
    itemDaLista.id = tarefasDoLocal[i].id;
    itemDaLista.addEventListener('click', colorirFundoDoItemDaListaAoClicar);
    itemDaLista.addEventListener('dblclick', riscarEDesriscarElementoDaLista);
    listaDeTarefas.appendChild(itemDaLista);
  }
}

// Carregando os parâmetros iniciais
window.onload = () => {
  if (localStorage.getItem('tarefas') !== null) colocarItensDoLocalStorage();
};

// Função do botão de adição de tarefas
function adicionarTarefa() {
  const novaTarefa = create('li');
  novaTarefa.innerText = inputTarefa.value;
  novaTarefa.id = 'naoLigado';
  novaTarefa.addEventListener('click', colorirFundoDoItemDaListaAoClicar);
  novaTarefa.addEventListener('dblclick', riscarEDesriscarElementoDaLista);
  inputTarefa.value = '';
  listaDeTarefas.appendChild(novaTarefa);
}

botaoAdicaoTarefa.addEventListener('click', adicionarTarefa);
