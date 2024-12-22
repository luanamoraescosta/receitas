document.addEventListener('DOMContentLoaded', () => {
    const xmlData = `
    <receitas>
        <doces>
            <receita id="1">
                <titulo>Bolo de banana sem farinha</titulo>
                <ingredientes>
                    <item>4 bananas</item>
                    <item>4 ovos</item>
                </ingredientes>
                <modosdefazer>
                    Aqueça no fogo por 30 minutos
                </modosdefazer>
            </receita>
        </doces>
        <salgados>
            <receita id="2">
                <titulo>Macarrão ao pesto</titulo>
                <ingredientes>
                    <item>manjerição</item>
                    <item>nozes</item>
                </ingredientes>
                <modosdefazer>
                    Bata no liquidificador
                </modosdefazer>
            </receita>
        </salgados>
    </receitas>
    `;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "text/xml");

    const receitasContainer = document.getElementById("receitasContainer");
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const categorySelect = document.getElementById("categorySelect");

    // Função para adicionar receitas ao contêiner
    const appendRecipes = (category) => {
        const receitas = category.getElementsByTagName("receita");
        let receitasHTML = '';

        for (let receita of receitas) {
            const titulo = receita.getElementsByTagName("titulo")[0].textContent;
            const ingredientes = receita.getElementsByTagName("ingredientes")[0].getElementsByTagName("item");
            const modosdefazer = receita.getElementsByTagName("modosdefazer")[0].textContent;

            // Criar lista de ingredientes
            let ingredientsList = '<ul>';
            for (let item of ingredientes) {
                ingredientsList += `<li>${item.textContent}</li>`;
            }
            ingredientsList += '</ul>';

            // Montar a estrutura HTML da receita
            receitasHTML += `
                <div class="receita" data-titulo="${titulo.toLowerCase()}" data-categoria="${category.nodeName.toLowerCase()}">
                    <div class="titulo">${titulo}</div>
                    <div class="ingredientes"><strong>Ingredientes:</strong>${ingredientsList}</div>
                    <div class="modosdefazer"><strong>Modo de fazer:</strong> ${modosdefazer}</div>
                </div>
            `;
        }

        return receitasHTML;
    };

    // Adiciona todas as receitas ao contêiner
    receitasContainer.innerHTML = appendRecipes(xmlDoc.getElementsByTagName("doces")[0]) +
                                  appendRecipes(xmlDoc.getElementsByTagName("salgados")[0]);

    // Função para filtrar receitas
    const filterRecipes = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categorySelect.value;
        const todasReceitas = document.querySelectorAll('.receita');

        todasReceitas.forEach(receita => {
            const titulo = receita.getAttribute('data-titulo');
            const categoria = receita.getAttribute('data-categoria');

            // Verificar se a receita corresponde ao filtro de categoria
            const categoryMatch = selectedCategory === "all" || selectedCategory === categoria;

            // Verificar se a receita corresponde ao termo de busca
            const searchMatch = titulo.includes(searchTerm);

            // Mostrar ou esconder a receita
            if (categoryMatch && searchMatch) {
                receita.style.display = "block"; // mostra a receita
            } else {
                receita.style.display = "none"; // oculta a receita
            }
        });
    };

    // Adiciona eventos
    searchButton.addEventListener('click', filterRecipes);
    categorySelect.addEventListener('change', filterRecipes);
});
