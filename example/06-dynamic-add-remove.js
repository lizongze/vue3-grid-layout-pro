const {VueGridLayout: VGL, Vue: VueInstance} = window;
const { createApp, ref, h, reactive, onMounted } = VueInstance

const { WidthProvider, Responsive } = VGL
const ResponsiveVueGridLayout = WidthProvider(Responsive);

const len = 20

const App = {
  setup(props, { attrs }) {
    const state = reactive({
      layout: [],
      layouts: {
        lg: [0, 1, 2, 3, 4].map(function(i, key, list) {
      return {
        i: i.toString(),
        x: i * 2,
        y: 0,
        w: 2,
        h: 2,
        add: i === (list.length - 1)
      };
    }),
      },
      newCounter: 0,
    })

    const createElement = (el) => {
      const removeStyle = {
        position: "absolute",
        right: "2px",
        top: 0,
        cursor: "pointer"
      };
      const i = el.add ? "+" : el.i;
    
      return h(
        'div',
        { key: i, 'data-grid': el },
        [
          el.add
            ? h(
                'span',
                {
                  class: 'add text',
                  onClick: onAddItem,
                  title: 'You can add an item by clicking here, too.'
                },
                'Add +'
              )
            : h('span', { class: 'text' }, i),
          h(
            'span',
            {
              class: 'remove',
              style: removeStyle,
              onClick: () => this.onRemoveItem(i)
            },
            'x'
          )
        ]
      );
    };

    const onAddItem = () => {
      /*eslint no-console: 0*/
      console.log("adding", "n" + state.newCounter);
      const { lg } = state.layouts;
      const newLg = lg.concat({
        i: "n" + state.newCounter,
        x: (lg.length * 2) % (state.cols || 12),
        y: Infinity, // puts it at the bottom
        w: 2,
        h: 2
      })
      console.log('items',newLg)
      state.newCounter = state.newCounter + 1
      state.layouts = { lg: newLg };
    }

    const onBreakpointChange = ({ breakpoint, cols }) => {
      state.breakpoint = breakpoint
      state.cols = cols
    };

    const onLayoutChange = (layout, layouts) => {
      state.layout = layout;
      if (layouts) {
        state.layouts = layouts;
      }
    }

    const onRemoveItem = (i) => {
      state.layouts = { lg: state.layouts.lg.filter(item => item.i !== i) };
    }
  
    return {
      state,
      onRemoveItem,
      onBreakpointChange,
      onLayoutChange,
      createElement,
      onAddItem
    }
  },
  components: {
    VGL,
    ResponsiveVueGridLayout
  },
  template: `
    <div>
      <h1>Vue Grid Layout</h1>
      <div>{{state.layouts.lg}}</div>
      <ResponsiveVueGridLayout
        :onLayoutChange="onLayoutChange"
        @breakpointChange="onBreakpointChange"
        breakpoint="lg"
        :rowHeight="30"
        :layouts="state.layouts"
        :containerPadding="[16, 16]"
      >
        <div v-for="(el, i) in state.layouts.lg" :key="el.add ? '+' : el.i" :data-grid="el">
          <span
            v-if="i === (state.layouts.lg.length - 1)"
            class="add text"
            @click="onAddItem"
            title="You can add an item by clicking here, too."
          >
           Add +
          </span>
          <span v-else class="text">------{{ el.i }}</span>
          <span
            class="remove"
            :style="{
              position: 'absolute',
              right: '2px',
              top: 0,
              cursor: 'pointer'
            }"
            @click="onRemoveItem(el.i)"
          >
            x
          </span>
        </div>
      </ResponsiveVueGridLayout>
    </div>
  `
};

createApp(App).mount('#container')
