import * as api from '../src/js/api.js';
import { normalizeString } from '../src/js/utils.js';
import { cardPolo, cardContentPolo } from '../src/js/components.js';
import { cardsContainer, searchBtn, searchPolo } from '../src/js/elements.js';

class Polo {
    static polos = [];
    static modalEdit = document.getElementById('editModal');
    static modalEditCtl = new bootstrap.Modal(Polo.modalEdit, {
        keyboard: false
    });
    static modalAdd = document.getElementById('addModal');
    static modalAddCtl = new bootstrap.Modal(Polo.modalAdd, {
        keyboard: false
    });
    static modalBtnSave = document.getElementById('save');
    static modalBtnAdd = document.getElementById('addBtn');
    static overlayLoad = document.getElementById('overlay-load-edit');
    static addPoloBtn = document.getElementById('addPolo');

    constructor(polo) {
        this.id = polo.id;
        this.nome = polo.nome;
        this.status = polo.status;
        this.mantenedor = polo.mantenedor;
        this.endereco = polo.endereco;
        this.cep = polo.cep;
        this.cidade = normalizeString(polo.cidade);
        this.estado = polo.estado;
        this.qt_alunos = polo.qt_alunos;
        this.razao_social = polo.razao_social;
        this.lat = polo.latitude;
        this.lng = polo.longitude;
        this.geom = polo.geom;

        this.init();

        Polo.polos.push(this);
    }

    init() {
        this.cardCol = document.getElementById(this.id);
        this.btnDel = this.cardCol.querySelector('.btn-outline-danger');
        this.btnEdt = this.cardCol.querySelector('.btn-outline-success');

        new bootstrap.Popover(this.btnDel, {
            title: 'Tem certeza que deseja deletar?',
            content: '<div class="d-flex justify-content-center gap-2"><span type="button" class="btn btn-primary btn-sim">Sim</span> <span type="button" class="btn btn-primary btn-nao">Não</span></div>',
            animation: true,
            html: true
        });

        this.bindEvents();
    }

    bindEvents() {
        this.btnDel.addEventListener('inserted.bs.popover', () => this.handleBtnDel()); // Deletar
        this.btnEdt.addEventListener('click', event => this.handleBtnEdt(event)); // Editar
    }
    
    handleBtnDel() {
        // Seleciona o conteúdo do popover
        const popoverElement = document.querySelector('.popover');
        
        if (popoverElement) {
            const botaoSim = popoverElement.querySelector('.btn-sim');
            const botaoNao = popoverElement.querySelector('.btn-nao');
            
            if (botaoSim) {
                botaoSim.addEventListener('click', () => {
                    this.removePolo();
                    bootstrap.Popover.getInstance(this.btnDel).hide();
                });
            }

            if (botaoNao) {
                botaoNao.addEventListener('click', () => {
                    bootstrap.Popover.getInstance(this.btnDel).hide();
                });
            }
        }
    }
    
    async handleBtnEdt(event) {
        Polo.modalBtnSave.setAttribute('data-polo-id', this.id);
        await Polo.loadCidadesModal(this.estado);

        modalEntriesSet(this, function(key, val, input) {
            input.value = null;

            if (input.tagName === 'SELECT') input.value = val;
            else if (input.tagName === 'INPUT') input.placeholder = val;
        })
    }

    hidePolo() {
        this.cardCol.classList.add('fade-out');
        this.cardCol.addEventListener('transitionend', () => {
            this.cardCol.classList.add('d-none');
        }, { once: true });
    }

    showPolo() {
        this.cardCol.classList.remove('d-none');

        void this.cardCol.offsetWidth;

        this.cardCol.classList.remove('fade-out');
    }

    async removePolo() {
        await api.deletarPolo(this.id);
        this.cardCol.classList.add('fade-out');
        this.cardCol.addEventListener('transitionend', () => {
            this.cardCol.remove();
        }, { once: true });
        const index = Polo.polos.findIndex(polo => polo.id === this.id);
        Polo.polos.splice(index, 1);
    }

    static addingCidades(cidades, add = false) {
        const added = new Set();
        const selectCidade = Polo.modalAdd.querySelector(`#cidade${add ? '_add' : ''} + select`);

        selectCidade.innerHTML = '';

        cidades.forEach(cidade => {
            const nomeCidade = cidade.nome;
            if (!added.has(nomeCidade)){
                added.add(nomeCidade);
                const option = document.createElement('option');
                option.value = normalizeString(nomeCidade);
                option.textContent = nomeCidade;
                selectCidade.appendChild(option);
            }
        })
    }

    static async loadCidadesModal(UF) {
        Polo.overlayLoad.style.visibility = 'visible';
        await api.IBGE(UF)
        .then(Polo.addingCidades);
        Polo.overlayLoad.style.visibility = 'hidden';
    }

    static async handleBtnSave(_) {
        const currentPoloId = Polo.modalBtnSave.getAttribute('data-polo-id');
        const currentPolo = Polo.polos.filter(polo => polo.id == currentPoloId)[0]

        modalEntriesSet(currentPolo, function(key, _, input) {
            currentPolo[key] = !input.value ? input.placeholder : input.value;
        })

        await api.atualizarPolo(currentPolo);
        Polo.modalEditCtl.hide();

        const poloContainer = document.getElementById(currentPolo.id).querySelector('.card-body');
        poloContainer.querySelector('h5').remove();
        poloContainer.querySelector('h6').remove();
        poloContainer.querySelector('p').remove();
        poloContainer.insertAdjacentHTML('afterbegin', cardContentPolo(currentPolo));
    }

    static handleAddPoloModal() {
        const campos = Polo.modalAdd.querySelectorAll('input, select');

        campos.forEach(campo => {
            campo.value = null;
            campo.placeholder = '';
        });
    }

    static async handleAddPoloAdd(event) {
        const campos = Polo.modalAdd.querySelectorAll('input, select');
        const polo = {};

        campos.forEach(campo => {
            const key = campo.getAttribute('aria-describedby');
            const val = campo.value;

            polo[key] = val;
        });

        await api.adicionarPolo(polo)
    }
}

Polo.modalBtnSave.addEventListener('click',
    Polo.handleBtnSave
)
Polo.modalEdit.querySelector('#estado + select')
.addEventListener('change', event => {
    const UF = event.target.value;
    api.IBGE(UF)
    .then(Polo.addingCidades);
});
Polo.modalAdd.querySelector('#estado_add + select')
.addEventListener('change', event => {
    const UF = event.target.value;
    api.IBGE(UF)
    .then(cidades => Polo.addingCidades(cidades, true));
});
Polo.addPoloBtn.addEventListener('click', 
    Polo.handleAddPoloModal
);
Polo.modalBtnAdd.addEventListener('click', 
    Polo.handleAddPoloAdd
);


api.buscarPolos()
.then(polos => {
    polos.forEach(polo => {
        cardsContainer.insertAdjacentHTML('beforeend', cardPolo(polo));
        new Polo(polo);
    });

    document.addEventListener('click', (event) => {
        const triggers = document.querySelectorAll('[data-bs-toggle="popover"]');

        let clicouEmTriggerOuPopover = false;

        triggers.forEach(trigger => {
            const popoverId = trigger.getAttribute('aria-describedby');
            const popoverEl = popoverId ? document.getElementById(popoverId) : null;

            if (
            trigger.contains(event.target) ||
                (popoverEl && popoverEl.contains(event.target))
            ) {
                clicouEmTriggerOuPopover = true;
            }
        });

        // Se clicou fora de todos, fecha todos
        if (!clicouEmTriggerOuPopover) {
                triggers.forEach(trigger => {
                bootstrap.Popover.getInstance(trigger)?.hide();
            });
        }
    });
});

function search(searchText) {
    Polo.polos.forEach(polo => {
        const match = polo.nome.toUpperCase().includes(searchText.toUpperCase());

        if (match) {
            polo.showPolo();
        } else {
            polo.hidePolo();
        }
    });
}

function modalEntriesSet(object, callback) {
    for (const [key, val] of Object.entries(object)) {
        const input = Polo.modalEdit.querySelector(`[aria-describedby="${key}"]`);
        
        if (!input) continue;

        callback(key, val, input);
    }
}

searchPolo.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        search(event.target.value);
    }
});

searchBtn.addEventListener('click', () => {
    search(searchPolo.value);
})