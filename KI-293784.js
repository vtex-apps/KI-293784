$(document).ready(function () {
  const style = document.createElement("style");
  style.innerHTML = `
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: #09f;
  
    animation: spin 1s ease infinite;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
  
    100% {
      transform: rotate(360deg);
    }
  }
  `;
  document.head.appendChild(style);

  function changeDeliveryWindow() {
    vtexjs.checkout
      .getOrderForm()
      .then((orderForm) => {
        const scheduledDeliveryList = document.querySelector(
          ".vtex-omnishipping-1-x-scheduledDeliveryList"
        );
        const spinner = document.createElement("div");
        spinner.className = "spinner";
        scheduledDeliveryList.parentElement.append(spinner);
        
        scheduledDeliveryList.classList.add("vtex-omnishipping-1-x-hide");
        var shippingData = orderForm.shippingData;
        const selectedSla = shippingData.logisticsInfo[0].selectedSla;

        var checkDeliveryWindow = false;
        shippingData.logisticsInfo[0].slas.forEach((sla) => {
          if (sla.id === selectedSla) {
            if (sla.deliveryWindow) {
              sla.deliveryWindow = null;
              checkDeliveryWindow = true;
            }
          }
        });
        if (checkDeliveryWindow) {
          shippingData.logisticsInfo[0] = {
            ...shippingData.logisticsInfo[0],
            selectedSla: null,
          };
          return vtexjs.checkout.sendAttachment("shippingData", shippingData);
        } else {
          scheduledDeliveryList.classList.remove("vtex-omnishipping-1-x-hide");
        }
      })
      .done(function () {
        const schedulerTongle = document.querySelector(
          "#scheduled-delivery-delivery"
        );
        if (
          schedulerTongle.classList.contains(
            "vtex-omnishipping-1-x-scheduleActive"
          )
        ) {
          setTimeout(() => {
            schedulerTongle.click();
            const scheduledDeliveryList = document.querySelector(
              ".vtex-omnishipping-1-x-scheduledDeliveryList"
            );
            scheduledDeliveryList.classList.remove(
              "vtex-omnishipping-1-x-hide"
            );
          }, 1000);
        }
      });
  }

  const observerScheduler = new MutationObserver((mutations, obsS) => {
    const schedulerTongle = document.querySelector(
      "#scheduled-delivery-delivery"
    );

    if (document.contains(schedulerTongle)) {
      console.log("scheduler found");

      schedulerTongle.addEventListener("mousedown", function () {
        if (
          schedulerTongle.classList.contains(
            "vtex-omnishipping-1-x-scheduleActive"
          )
        ) {
          console.log("Apagar");
          changeDeliveryWindow();
        } else {
          console.log("Prender");
          //volver a poner fechas cargadas
        }
      });

      obsS.disconnect();

      return;
    }
  });

  observerScheduler.observe(document, {
    childList: true,
    subtree: true,
  });
});
