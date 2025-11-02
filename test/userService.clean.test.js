const { UserService } = require("../src/userService");

const DADOS_USUARIO_PADRAO = {
  nome: "Fulano de Tal",
  email: "fulano@teste.com",
  idade: 25,
};

describe("UserService - Testes Limpos", () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  test("deve criar um usuário corretamente", () => {
    // Arrange
    const { nome, email, idade } = DADOS_USUARIO_PADRAO;

    // Act
    const usuarioCriado = userService.createUser(nome, email, idade);

    // Assert
    expect(usuarioCriado).toHaveProperty("id");
    expect(usuarioCriado.nome).toBe(nome);
    expect(usuarioCriado.email).toBe(email);
    expect(usuarioCriado.status).toBe("ativo");
  });

  test("deve buscar um usuário existente pelo ID", () => {
    // Arrange
    const usuario = userService.createUser("Maria", "maria@teste.com", 22);

    // Act
    const usuarioBuscado = userService.getUserById(usuario.id);

    // Assert
    expect(usuarioBuscado).toEqual(usuario);
  });

  test("deve desativar um usuário comum", () => {
    // Arrange
    const usuarioComum = userService.createUser("Comum", "comum@teste.com", 30);

    // Act
    const resultado = userService.deactivateUser(usuarioComum.id);
    const usuarioAtualizado = userService.getUserById(usuarioComum.id);

    // Assert
    expect(resultado).toBe(true);
    expect(usuarioAtualizado.status).toBe("inativo");
  });

  test("não deve desativar um usuário administrador", () => {
    // Arrange
    const usuarioAdmin = userService.createUser(
      "Admin",
      "admin@teste.com",
      40,
      true
    );

    // Act
    const resultado = userService.deactivateUser(usuarioAdmin.id);
    const usuarioAtualizado = userService.getUserById(usuarioAdmin.id);

    // Assert
    expect(resultado).toBe(false);
    expect(usuarioAtualizado.status).toBe("ativo");
  });

  test("deve gerar um relatório de usuários formatado corretamente", () => {
    // Arrange
    const usuario1 = userService.createUser("Alice", "alice@email.com", 28);
    const usuario2 = userService.createUser("Bob", "bob@email.com", 32);

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain(
      `ID: ${usuario1.id}, Nome: Alice, Status: ativo`
    );
    expect(relatorio).toContain(`ID: ${usuario2.id}, Nome: Bob, Status: ativo`);
    expect(relatorio.startsWith("--- Relatório de Usuários ---")).toBe(true);
  });

  test("deve lançar erro ao tentar criar usuário menor de idade", () => {
    // Arrange
    const nome = "Menor";
    const email = "menor@email.com";
    const idade = 17;

    // Act & Assert
    expect(() => userService.createUser(nome, email, idade)).toThrow(
      "O usuário deve ser maior de idade."
    );
  });
});
