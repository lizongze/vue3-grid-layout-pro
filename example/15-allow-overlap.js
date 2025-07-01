const {VueGridLayout: VGL, Vue: VueInstance} = window;
const { createApp, ref, h, reactive, onMounted } = VueInstance
// import { cloneDeep } from 'lodash';
const { WidthProvider } = VGL
const VueGridLayout = WidthProvider(VGL);

const len = 30

const App = {
  setup(props, { attrs }) {
    const generateLayout = () => {
      return Array.from({ length: len }, (item, i) => {
        const y = Math.ceil(Math.random() * 4) + 1;
        return {
          x: Math.round(Math.random() * 5) * 2,
          y: Math.floor(i / 6) * y,
          w: 2,
          h: y,
          i: (i + 1).toString()
        };
      });
    }

    const state = reactive({
      layout: generateLayout(),
      allowOverlap: true,
    })

    // setTimeout(() => {
    //   state.allowOverlap = false;
    // }, 5000)

    const handleLayoutChange = (layout, newLayout) => {
      console.log('layout change --', layout, newLayout)
      state.layout = layout;
    }

    return {
      handleLayoutChange,
      state
    }
  },
  components: {
    VueGridLayout
  },
  template: `
    <div>
      <h1>Vue Grid Layout</h1>
      <div class="layoutJSON">
        Displayed as <code>[x, y, w, h]</code>:
        <div class="columns">
          <div v-for="l in state.layout" :key="l.i" class="layoutItem">
            <b>{{ l.i === '__dropping-elem__' ? 'drop' : l.i }}</b>
            {{ ":"+l.x+","+l.y+","+l.w+","+l.h }}
          </div>
        </div>
      </div>
      {{state.layout}}
      <VueGridLayout
        v-model="state.layout"
        :rowHeight="30"
        :cols="12"
        :allowOverlap="state.allowOverlap"
        :containerPadding="[16, 16]"
        :onLayoutChange="handleLayoutChange"
      >
        <div v-for="item in state.layout" :key="item.i">
          <span class="text">{{ item.i }}</span>
        </div>
      </VueGridLayout>
    </div>
  `
};

createApp(App).mount('#container')
