import Vue from "vue";
import { uid } from "quasar";

const state = {
  isLoggedIn: null,
  notes: {
    ID1: {
      noteName: "Note shop",
      label: "C",
      subject: "BTI",
      date: "12/10/2019"
    },
    ID2: {
      noteName: "Note2",
      label: "C",
      subject: "BCO",
      date: "05/12/2020"
    },
    ID3: {
      noteName: "Note3",
      label: "S",
      subject: "ATP",
      date: "23/02/2020"
    }
  },
  search: ""
};

const mutations = {
  updateNote(state, payload) {
    Object.assign(state.notes[payload.id], payload.updates);
  },
  deleteNote(state, id) {
    console.log("deleted note: ", id);
    Vue.delete(state.notes, id);
  },
  addNote(state, payload) {
    Vue.set(state.notes, payload.id, payload.note);
  },
  setSearch(state, value) {
    state.search = value;
  },

  switchIsLogin(state) {
    state.isLoggedIn = !state.isLoggedIn;
  }
};

const actions = {
  updateNote({ commit }, payload) {
    commit("updateNote", payload);
  },
  deleteNote({ commit }, id) {
    commit("deleteNote", id);
  },
  addNote({ commit }, note) {
    let noteId = uid();
    let payload = {
      id: noteId,
      note: note
    };
    commit("addNote", payload);
  },
  setSearch({ commit }, value) {
    commit("setSearch", value);
  },
  switchIsLogin({ commit }) {
    commit("switchIsLoggedIn");
  }
};

const getters = {
  notesFiltered: state => {
    let notesFiltered = {};
    if (state.search) {
      Object.keys(state.notes).forEach(function(key) {
        let note = state.notes[key];
        if (
          note.noteName.includes(state.search) ||
          note.subject.includes(state.search)
        ) {
          notesFiltered[key] = note;
        }
      });
      return notesFiltered;
    }
    return state.notes;
  },
  notes: (state, getters) => {
    return getters.notesFiltered;
  },
  isLoggedIn: state => {
    return state.isLoggedIn;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
