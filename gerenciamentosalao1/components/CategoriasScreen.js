// components/CategoriasScreen.js
import React, { useEffect, useState } from "react";
import { View, FlatList, Alert, Platform } from "react-native";
import firebase from "../Firebase";
import { Card, TextInput, Button, List } from "react-native-paper";

import { styles } from "./Utils";

export default function CategoriasScreen() {
  const [key, setKey] = useState("");
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  const [categorias, setCategorias] = useState([]);

  const [botaoInserir, setBotaoInserir] = useState(false);
  const [botaoAlterarExcluir, setBotaoAlterarExcluir] = useState(true);

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

  // Carrega categorias em tempo real
  useEffect(() => {
    const ref = firebase.database().ref("categorias");

    const listener = ref.on("value", (snapshot) => {
      const data = snapshot.val();
      const lista = [];

      if (data) {
        Object.keys(data).forEach((k) => {
          lista.push({
            key: k,
            nome: data[k].nome,
            descricao: data[k].descricao,
          });
        });
      }

      setCategorias(lista);
    });

    return () => ref.off("value", listener);
  }, []);

  function limparCampos() {
    setKey("");
    setNome("");
    setDescricao("");
    setBotaoInserir(false);
    setBotaoAlterarExcluir(true);
  }

  function selecionar(chave, n, d) {
    setKey(chave);
    setNome(n);
    setDescricao(d);
    setBotaoInserir(true);
    setBotaoAlterarExcluir(false);
  }

  async function inserirCategoria() {
    try {
      if (!nome || !descricao) {
        showMsg("Atenção", "Preencha Nome e Descrição.");
        return;
      }

      await firebase.database().ref("categorias").push({
        nome,
        descricao,
      });

      showMsg("Sucesso", "Registro inserido com sucesso!");
      limparCampos();
    } catch (e) {
      showMsg("Erro ao inserir", String(e?.message || e));
    }
  }

  async function alterarCategoria() {
    try {
      if (!key) {
        showMsg("Atenção", "Selecione um registro para alterar.");
        return;
      }
      if (!nome || !descricao) {
        showMsg("Atenção", "Preencha Nome e Descrição.");
        return;
      }

      await firebase.database().ref("categorias/" + key).update({
        nome,
        descricao,
      });

      showMsg("Sucesso", "Registro alterado com sucesso!");
      limparCampos();
    } catch (e) {
      showMsg("Erro ao alterar", String(e?.message || e));
    }
  }

  function excluirCategoria() {
    if (!key) {
      showMsg("Atenção", "Selecione um registro para excluir.");
      return;
    }

    showConfirm(
      "Mensagem",
      "Deseja realmente excluir esse registro?",
      async () => {
        try {
          await firebase.database().ref("categorias/" + key).remove();
          showMsg("Sucesso", "Registro excluído com sucesso!");
          limparCampos();
        } catch (e) {
          showMsg("Erro ao excluir", String(e?.message || e));
        }
      },
      () => {
        // NÃO: opcionalmente limpa seleção
        limparCampos();
      }
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title="Gerenciar Categorias"
          subtitle="Dados das categorias de serviço"
        />

        <Card.Content>
          <TextInput
            mode="outlined"
            label="Nome"
            placeholder="Digite o nome da categoria"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="Descrição"
            placeholder="Digite a descrição"
            value={descricao}
            onChangeText={setDescricao}
            style={styles.input}
          />
        </Card.Content>

        <Card.Actions>
          <Button
            icon="plus"
            mode="contained"
            style={styles.buttonCrud}
            disabled={botaoInserir}
            onPress={inserirCategoria}
          />

          <Button
            icon="pencil"
            mode="contained"
            style={styles.buttonCrud}
            disabled={botaoAlterarExcluir}
            onPress={alterarCategoria}
          />

          <Button
            icon="delete"
            mode="contained"
            style={styles.buttonCrud}
            disabled={botaoAlterarExcluir}
            onPress={excluirCategoria}
          />

          <Button
            icon="cancel"
            mode="contained"
            style={styles.buttonCrud}
            onPress={limparCampos}
          />
        </Card.Actions>
      </Card>

      <List.Section>
        <List.Subheader>Categorias registradas</List.Subheader>

        <FlatList
          data={categorias}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <List.Item
              title={item.nome}
              description={item.descricao}
              left={() => <List.Icon icon="arrow-right" />}
              onPress={() => selecionar(item.key, item.nome, item.descricao)}
            />
          )}
        />
      </List.Section>
    </View>
  );
}