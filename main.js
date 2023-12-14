const { createApp, ref, onMounted, nextTick } = Vue;

function $savefile(data, name) {
  var urlObject = window.URL || window.webkitURL || window;
  var export_blob = new Blob([data]);
  var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
  save_link.href = urlObject.createObjectURL(export_blob);
  save_link.download = name;
  save_link.click();
}

const setup = () => {
  const contentRef = ref();

  const finish = ref(false);
  const options = [
    {
      label: "泰国人名",
      value: "thai-name-generator",
    },
    {
      label: "巴西人名",
      value: "brazilian-name-generator",
    },
  ];
  const active_index = ref(0);

  const count = ref("");
  const loading = ref(false);
  const data = ref([]);

  const start = async () => {
    if (data.value.length >= count.value || finish.value) {
      finish.value = true;
      loading.value = false;
      return;
    }

    await axios
      .get(
        `https://story-shack-cdn-v2.glitch.me/generators/${
          options[active_index.value].value
        }?count=10`
      )
      .then((res) => {
        const v = res.data.data.map((item) => {
          return `${item.female} ${item.lastName}`;
        });
        data.value.push(...v);
      });

    nextTick(() => {
      contentRef.value.scrollTop = contentRef.value.scrollHeight;
    });
    start();
  };

  const handleStart = () => {
    data.value = [];
    loading.value = true;
    finish.value = false;
    start();
  };

  /* 选择 */
  const handleSelect = (index) => {
    if (loading.value) return;
    active_index.value = index;
  };

  /* 停止 */
  const handleStop = () => {
    finish.value = true;
  };

  /* 导出 */
  const handleExport = () => {
    $savefile(
      data.value.join("\n"),
      `${options[active_index.value].label}.txt`
    );
  };

  return {
    count,
    data,
    handleExport,
    handleStart,
    options,
    active_index,
    loading,
    handleSelect,
    finish,
    contentRef,
    handleStop,
  };
};

const app = createApp({ setup });

app.mount("#app");
