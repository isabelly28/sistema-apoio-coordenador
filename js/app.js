const STORAGE_KEY = "sac_questions_v2";
const DEMO_EMAIL = "coordenador@anhanguera.com";
const DEMO_PASSWORD = "123456";
const defaultQuestions = [
  {id:1,category:"Prazos",title:"Onde consulto os prazos das atividades?",answer:"Consulte o calendário acadêmico e os avisos no ambiente virtual de aprendizagem. Verifique também a data de entrega informada na disciplina. Se houver divergência, procure o professor ou a coordenação."},
  {id:2,category:"Documentos",title:"Como solicito uma declaração de matrícula?",answer:"Solicite pelos canais oficiais de atendimento ao aluno ou pelo portal acadêmico, quando disponível. Confira o prazo de emissão e como obter o documento."},
  {id:3,category:"Horários",title:"Onde vejo meu horário de aulas?",answer:"Consulte a grade de horários no portal ou ambiente virtual da instituição. Confira os comunicados mais recentes do seu curso."},
  {id:4,category:"Provas e atividades",title:"Como verifico as datas das provas?",answer:"Confira o calendário da disciplina, os avisos do professor e as informações no ambiente virtual. Em caso de dúvida, entre em contato com o professor ou a coordenação."},
  {id:5,category:"Procedimentos acadêmicos",title:"O que fazer se eu perder uma atividade?",answer:"Leia as regras da disciplina e os comunicados sobre atividades substitutivas ou segunda chamada. Os procedimentos e prazos podem variar."},
  {id:6,category:"Documentos",title:"Como atualizo meus dados cadastrais?",answer:"Entre no portal acadêmico e verifique a área de dados pessoais. Se não for possível alterar diretamente, solicite atualização ao atendimento da instituição."},
  {id:7,category:"Prazos",title:"Como acompanho o calendário acadêmico?",answer:"Consulte os comunicados oficiais e o calendário disponibilizado pela instituição. Anote os prazos importantes e confira se houve atualizações."},
  {id:8,category:"Procedimentos acadêmicos",title:"Com quem falo se minha dúvida não estiver aqui?",answer:"Procure os canais oficiais de atendimento ao aluno ou entre em contato com a coordenação do seu curso para receber orientação."}
];
let questions = loadQuestions();
let currentSearch = "";

function loadQuestions() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.warn("Não foi possível carregar as perguntas salvas.", error);
  }
  return defaultQuestions.map(q => ({...q}));
}
function saveQuestions() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    return true;
  } catch (error) {
    alert("Não foi possível salvar neste navegador. Verifique as configurações de armazenamento.");
    return false;
  }
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function normalize(value) {
  return String(value || "").toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function go(screenId) {
  const protectedScreens = ["painel", "gerenciar", "nova-pergunta", "editar-pergunta"];
  if (protectedScreens.includes(screenId) && sessionStorage.getItem("sac_logged") !== "yes") {
    screenId = "login";
  }
  const target = document.getElementById(screenId);
  if (!target) return;
  document.querySelectorAll(".screen").forEach(screen => screen.classList.remove("active"));
  target.classList.add("active");
  window.scrollTo({top:0,behavior:"smooth"});
  if (screenId === "inicio") renderHome();
  if (screenId === "resultados") renderResults();
  if (screenId === "painel") renderStats();
  if (screenId === "gerenciar") renderManage();
}
function focusSearch() {
  go("inicio");
  window.setTimeout(() => document.getElementById("home-search")?.focus(), 80);
}
function renderCategories() {
  const host = document.getElementById("category-list");
  const categories = [...new Set(questions.map(q => q.category))].sort((a,b) => a.localeCompare(b,"pt-BR"));
  host.innerHTML = categories.map(category => '<button class="category-chip" type="button" data-category="'+escapeHTML(category)+'">'+escapeHTML(category)+'</button>').join("");
  host.querySelectorAll("[data-category]").forEach(button => button.addEventListener("click", () => {
    currentSearch = button.dataset.category;
    document.getElementById("results-search").value = currentSearch;
    go("resultados");
  }));
}
function questionCard(question) {
  return '<article class="question-card"><span class="pill">'+escapeHTML(question.category)+'</span><h3>'+escapeHTML(question.title)+'</h3><p>'+escapeHTML(question.answer.length > 125 ? question.answer.slice(0,125)+"…" : question.answer)+'</p><button class="card-action" type="button" onclick="showAnswer('+Number(question.id)+')">Ler resposta →</button></article>';
}
function renderHome() {
  renderCategories();
  const host = document.getElementById("home-questions");
  const featured = questions.slice(0,6);
  host.innerHTML = featured.length ? featured.map(questionCard).join("") : '<div class="empty-state">Ainda não há perguntas cadastradas.</div>';
}
function showAllResults() {
  currentSearch = "";
  document.getElementById("results-search").value = "";
  go("resultados");
}
function renderResults() {
  const input = document.getElementById("results-search");
  if (input && currentSearch && !input.value) input.value = currentSearch;
  const term = normalize(input?.value || currentSearch);
  const found = questions.filter(q => normalize(q.title+" "+q.category+" "+q.answer).includes(term));
  document.getElementById("results-summary").textContent = found.length+" resultado(s) encontrado(s)";
  document.getElementById("results-list").innerHTML = found.length ? found.map(questionCard).join("") : '<div class="empty-state">Nenhuma pergunta encontrada. Tente outra palavra-chave ou consulte a coordenação.</div>';
}
function showAnswer(id) {
  const question = questions.find(item => Number(item.id) === Number(id));
  if (!question) return;
  document.getElementById("answer-category").textContent = question.category;
  document.getElementById("answer-title").textContent = question.title;
  document.getElementById("answer-body").textContent = question.answer;
  go("resposta");
}
function renderStats() {
  document.getElementById("stat-total").textContent = questions.length;
  document.getElementById("stat-categories").textContent = new Set(questions.map(q => q.category)).size;
}
function renderManage() {
  const input = document.getElementById("manage-search");
  const term = normalize(input?.value || "");
  const found = questions.filter(q => normalize(q.title+" "+q.category).includes(term));
  document.getElementById("manage-count").textContent = found.length+" pergunta(s) cadastrada(s)";
  document.getElementById("manage-body").innerHTML = found.length ? found.map(q =>
    '<tr><td>'+escapeHTML(q.title)+'</td><td>'+escapeHTML(q.category)+'</td><td><div class="table-actions"><button class="btn btn-outline btn-small" onclick="editQuestion('+Number(q.id)+')">Editar</button><button class="btn btn-danger btn-small" onclick="deleteQuestion('+Number(q.id)+')">Excluir</button></div></td></tr>'
  ).join("") : '<tr><td colspan="3">Nenhuma pergunta encontrada.</td></tr>';
}
function newQuestion() {
  document.getElementById("new-question-form").reset();
  go("nova-pergunta");
  document.getElementById("new-title").focus();
}
function editQuestion(id) {
  const q = questions.find(item => Number(item.id) === Number(id));
  if (!q) return;
  document.getElementById("edit-id").value = q.id;
  document.getElementById("edit-title").value = q.title;
  document.getElementById("edit-category").value = q.category;
  document.getElementById("edit-answer").value = q.answer;
  go("editar-pergunta");
}
function deleteQuestion(id) {
  const q = questions.find(item => Number(item.id) === Number(id));
  if (!q || !confirm('Deseja excluir a pergunta "'+q.title+'"?')) return;
  const old = questions;
  questions = questions.filter(item => Number(item.id) !== Number(id));
  if (!saveQuestions()) { questions = old; return; }
  renderManage();
  renderStats();
  renderHome();
  toast("Pergunta excluída.");
}
function toast(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.remove("hidden");
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => el.classList.add("hidden"), 2600);
}
function logout() {
  sessionStorage.removeItem("sac_logged");
  go("inicio");
  toast("Você saiu da área do coordenador.");
}

document.getElementById("home-search-form").addEventListener("submit", event => {
  event.preventDefault();
  currentSearch = document.getElementById("home-search").value.trim();
  document.getElementById("results-search").value = currentSearch;
  go("resultados");
});
document.getElementById("results-search-form").addEventListener("submit", event => {
  event.preventDefault();
  currentSearch = document.getElementById("results-search").value.trim();
  renderResults();
});
document.getElementById("results-search").addEventListener("input", () => {
  currentSearch = document.getElementById("results-search").value.trim();
  renderResults();
});
document.getElementById("manage-search").addEventListener("input", renderManage);
document.getElementById("login-form").addEventListener("submit", event => {
  event.preventDefault();
  const email = document.getElementById("login-email").value.trim().toLowerCase();
  const password = document.getElementById("login-password").value;
  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    sessionStorage.setItem("sac_logged", "yes");
    document.getElementById("login-error").classList.add("hidden");
    event.target.reset();
    go("painel");
  } else {
    const error = document.getElementById("login-error");
    error.textContent = "E-mail ou senha incorretos. Use as credenciais de demonstração indicadas na tela.";
    error.classList.remove("hidden");
  }
});
document.getElementById("new-question-form").addEventListener("submit", event => {
  event.preventDefault();
  const item = {
    id: Date.now(),
    title: document.getElementById("new-title").value.trim(),
    category: document.getElementById("new-category").value,
    answer: document.getElementById("new-answer").value.trim()
  };
  if (!item.title || !item.answer) return;
  questions = [item, ...questions];
  if (!saveQuestions()) { questions = questions.filter(q => q.id !== item.id); return; }
  event.target.reset();
  go("gerenciar");
  toast("Pergunta cadastrada com sucesso.");
});
document.getElementById("edit-question-form").addEventListener("submit", event => {
  event.preventDefault();
  const id = Number(document.getElementById("edit-id").value);
  const previous = questions;
  const updated = {
    id,
    title: document.getElementById("edit-title").value.trim(),
    category: document.getElementById("edit-category").value,
    answer: document.getElementById("edit-answer").value.trim()
  };
  if (!updated.title || !updated.answer) return;
  questions = questions.map(q => Number(q.id) === id ? updated : q);
  if (!saveQuestions()) { questions = previous; return; }
  go("gerenciar");
  toast("Pergunta atualizada com sucesso.");
});

// Inicialização do protótipo.
renderHome();
document.getElementById("toast").classList.add("hidden");