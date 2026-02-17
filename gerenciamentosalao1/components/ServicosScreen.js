// components/ServicosScreen.js
import { List, TextInput, Button, Card } from "react-native-paper";
import { ScrollView, FlatList, Alert, Platform } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { styles } from "./Utils";
import { useEffect, useState } from "react";
import firebase from "../Firebase";

export default function ServicosScreen() {
  const [key, setKey] = useState("");
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState(null);

  const [servicos, setServicos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [botaoAlterarExcluir, setBotaoAlterarExcluir] = useState(true);
  const [botaoInserir, setBotaoInserir] = useState(false);

  const categoriaPlaceholder = { label: "Selecione uma categoria", value: null };

  // Mensagens/confirmação compatíveis com Web + Android/iOS
  const showMsg = (titulo, msg) => {
    if (Platform.OS === "web") {
      window.alert(`${titulo}\n\n${msg}`);
    } else {
      Alert.alert(titulo, msg);
    }
  };

  const showConfirm = (titulo, msg, onYes, onNo) => {
    if (Platform.OS === "web") {
      const ok = window.confirm(`${titulo}\n\n${msg}`);
      if (ok) onYes?.();
      else onNo?.();
      return;
    }

    Alert.alert(titulo, msg, [
      { text: "NÃO", style: "cancel", onPress: () => onNo?.() },
      { text: "SIM", onPress: () => onYes?.() },
    ]);
  };

  useEffect(() => {
    selecionarTodos();
  }, []);

  const selecionarTodos = () => {
    // Categorias
    firebase.database().ref("categorias").orderByChild("nome").off();
    firebase
      .database()
      .ref("categorias")
      .orderByChild("nome")
      .on("value", (snapshot) => {
        const itensCategorias = [];
        snapshot.forEach((linha) => {
          itensCategorias.push({
            label: linha.val().nome,
            value: linha.val().nome,
          });
        });
        setCategorias(itensCategorias);
      });

    // Serviços
    firebase.database().ref("servicos").orderByChild("nome").off();
    firebase
      .database()
      .ref("servicos")
      .orderByChild("nome")
      .on("value", (snapshot) => {
        const itensServicos = [];
        snapshot.forEach((linha) => {
          itensServicos.push({
            key: linha.key,
            nome: linha.val().nome,
            descricao: linha.val().descricao,
            valor: linha.val().valor,
            categoria: linha.val().categoria,
          });
        });
        setServicos(itensServicos);
      });
  };

  const cancelar = () => {
    setKey("");
    setNome("");
    setDescricao("");
    setValor("");
    setCategoria(null);
    setBotaoAlterarExcluir(true);
    setBotaoInserir(false);
  };

  const selecionar = (k, n, d, v, c) => {
    setKey(k);
    setNome(n);
    setDescricao(d);
    setValor(v);
    setCategoria(c);
    setBotaoAlterarExcluir(false);
    setBotaoInserir(true);
  };

  const inserirServico = async () => {
    if (!nome.trim() || !descricao.trim() || !valor.trim() || !categoria) {
      showMsg("Atenção", "Preencha Nome, Descrição, Valor e selecione uma Categoria.");
      return;
    }

    try {
      await firebase.database().ref("servicos").push({
        nome: nome.trim(),
        descricao: descricao.trim(),
        valor: valor.trim(),
        categoria: categoria,
      });

      showMsg("Sucesso", "Registro inserido com sucesso!");
      cancelar();
    } catch (e) {
      showMsg("Erro ao inserir", String(e?.message || e));
    }
  };

  const alterarServico = async () => {
    if (!key) {
      showMsg("Atenção", "Selecione um serviço na lista.");
      return;
    }
    if (!nome.trim() || !descricao.trim() || !valor.trim() || !categoria) {
      showMsg("Atenção", "Preencha Nome, Descrição, Valor e selecione uma Categoria.");
      return;
    }

    try {
      await firebase.database().ref("servicos").child(key).update({
        nome: nome.trim(),
        descricao: descricao.trim(),
        valor: valor.trim(),
        categoria: categoria,
      });

      showMsg("Sucesso", "Registro alterado com sucesso!");
      cancelar();
    } catch (e) {
      showMsg("Erro ao alterar", String(e?.message || e));
    }
  };

  const excluirServico = () => {
    if (!key) {
      showMsg("Atenção", "Selecione um serviço na lista.");
      return;
    }

    showConfirm(
      "Mensagem",
      "Deseja realmente excluir esse registro?",
      async () => {
        try {
          await firebase.database().ref("servicos").child(key).remove();
          showMsg("Sucesso", "Registro excluído com sucesso!");
          cancelar();
        } catch (e) {
          showMsg("Erro ao excluir", String(e?.message || e));
        }
      },
      () => {
        // NÃO: a professora limpava a seleção, então mantive igual
        cancelar();
      }
    );
  };

  return (
    <ScrollView>
      <Card style={{ margin: 10 }}>
        <Card.Title title="Gerenciar Serviços" subtitle="Dados de serviços" />
        <Card.Content>
          <TextInput
            onChangeText={setNome}
            value={nome}
            mode="outlined"
            label="Nome"
            placeholder="Digite o nome do serviço"
          />

          <TextInput
            onChangeText={setDescricao}
            value={descricao}
            mode="outlined"
            label="Descrição"
            placeholder="Digite a descrição do serviço"
          />

          <TextInput
            onChangeText={setValor}
            value={valor}
            keyboardType="numeric"
            mode="outlined"
            label="Valor"
            placeholder="Digite o valor do serviço"
          />

          <RNPickerSelect
            items={categorias}
            onValueChange={(c) => setCategoria(c)}
            placeholder={categoriaPlaceholder}
            value={categoria}
          />
        </Card.Content>

        <Card.Actions>
          <Button
            icon="plus"
            mode="contained"
            style={styles.buttonCrud}
            disabled={botaoInserir}
            onPress={inserirServico}
          />

          <Button
            icon="pencil"
            mode="contained"
            style={styles.buttonCrud}
            disabled={botaoAlterarExcluir}
            onPress={alterarServico}
          />

          <Button
            icon="delete"
            mode="contained"
            style={styles.buttonCrud}
            disabled={botaoAlterarExcluir}
            onPress={excluirServico}
          />

          <Button
            icon="cancel"
            mode="contained"
            style={styles.buttonCrud}
            onPress={cancelar}
          />
        </Card.Actions>
      </Card>

      <List.Section>
        <List.Subheader>Serviços registrados</List.Subheader>
        <FlatList
          data={servicos}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <List.Item
              title={item.nome}
              description={`${item.descricao} | R$ ${item.valor} | ${item.categoria}`}
              left={() => <List.Icon icon="arrow-right" />}
              onPress={() =>
                selecionar(item.key, item.nome, item.descricao, item.valor, item.categoria)
              }
            />
          )}
        />
      </List.Section>
    </ScrollView>
  );
}