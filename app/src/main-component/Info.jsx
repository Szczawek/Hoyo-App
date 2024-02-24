export default function Info() {
  return <div style={{display:"grid"}} className="SDSDSDSs">
  </div>
}

function Test() {
  return (
    <div
      className="
  ">
      <h3>Test</h3>
      <p>szczawik</p>
    </div>
  );
}

const test = async (e) => {
  try {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    await new Promise((resolve) => {
      const render = new FileReader();
      render.readAsDataURL(file);
      render.onload = () => {
        const img = new Image();
        img.src = render.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const newWidth = 300; // Nowa szerokość
          const newHeight = 300; // Nowa wysokość
          canvas.width = newWidth;
          canvas.height = newHeight;

          // Narysuj obraz na canvas w nowych wymiarach
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          const resizeImgURL = canvas.toBlob(
            (blob) => {
              const nextFile = new File([blob], file.name, {
                type: "image/jpeg",
              });
              form.append("myFile", nextFile);
              resolve(console.log("Ok"));
            },
            "image/jpeg",
            1
          );
        };
      };
    });
    await fetch("http://localhost/mixer", {
      method: "POST",
      body: form,
    });
  } catch (err) {
    throw err;
  }
};
