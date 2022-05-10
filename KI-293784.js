$(document).ready(function () {
  function setLoadingStyles() {
    const style = document.createElement("style");
    style.innerHTML = `
  #spinner {
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
  }

  function addLoading() {
    const scheduledDeliveryList = document.querySelector(
      ".vtex-omnishipping-1-x-scheduledDeliveryList"
    );
    scheduledDeliveryList.classList.add("vtex-omnishipping-1-x-hide");
    const spinner = document.createElement("div");
    spinner.setAttribute("id", "spinner");
    scheduledDeliveryList.parentElement.append(spinner);
  }

  function removeLoading() {
    const scheduledDeliveryList = document.querySelector(
      ".vtex-omnishipping-1-x-scheduledDeliveryList"
    );
    scheduledDeliveryList.classList.remove("vtex-omnishipping-1-x-hide");
    const spinnerElement = document.querySelectorAll("#spinner");
    spinnerElement.forEach((e) => e.remove());
  }

  function changeDeliveryWindow() {
    vtexjs.checkout
      .getOrderForm()
      .then((orderForm) => {
        var shippingData = orderForm.shippingData;
        const selectedSla = shippingData.logisticsInfo[0].selectedSla;
        var hasDeliveryWindow = false;
        shippingData.logisticsInfo.forEach((logisticsInfo) => {
          logisticsInfo.slas.forEach((sla) => {
            if (sla.id === selectedSla) {
              if (sla.deliveryWindow) {
                sla.deliveryWindow = null;
                hasDeliveryWindow = true;
              }
            }
          });
        });

        if (hasDeliveryWindow) {
          addLoading();
          shippingData.logisticsInfo = shippingData.logisticsInfo.map(
            (logisticsInfo) => {
              return {
                ...logisticsInfo,
                selectedSla: null,
              };
            }
          );

          return vtexjs.checkout.sendAttachment("shippingData", shippingData);
        }
        return null;
      })
      .done(function (orderForm) {
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
            removeLoading();
          }, 1500);
        } else {
          removeLoading();
        }
      });
  }

  function addFakeDeliveyWindow() {
    vtexjs.checkout
      .getOrderForm()
      .then((orderForm) => {
        var shippingData = orderForm.shippingData;
        const selectedSla = shippingData.logisticsInfo[0].selectedSla;
        var hasDeliveryWindow = false;
        shippingData.logisticsInfo.forEach((logisticsInfo) => {
          logisticsInfo.slas.forEach((sla) => {
            if (sla.id === selectedSla) {
              if (!sla.deliveryWindow) {
                const deliveryTest = {
                  courierId: null,
                  courierName: null,
                  dockId: null,
                  kitItemDetails: [],
                  quantity: 0,
                  warehouseId: null,
                };

                sla.deliveryWindow = [deliveryTest];
                hasDeliveryWindow = true;
              }
            }
          });
        });

        return vtexjs.checkout.sendAttachment("shippingData", shippingData);
      })
      .done(function () {
        console.log("Done addFakeDeliveyWindow");
      });
  }

  function addSchedulerObserver() {
    const observerScheduler = new MutationObserver((mutations, obsS) => {
      const schedulerTongle = document.querySelector(
        "#scheduled-delivery-delivery"
      );

      if (document.contains(schedulerTongle)) {
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
            //Poner loading
            addFakeDeliveyWindow();
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
  }

  function addDeliveryObserver() {
    let isActiveObserverScheduler = false;

    const observerDelivery = new MutationObserver((mutations, obsD) => {
      const deliveryOption = document.querySelectorAll(
        "#shipping-option-delivery"
      )[0];
      if (document.contains(deliveryOption)) {
        if (
          deliveryOption.classList.contains(
            "vtex-omnishipping-1-x-deliveryOptionActive"
          )
        ) {
          if (!isActiveObserverScheduler) {
            isActiveObserverScheduler = true;
            addSchedulerObserver();
          }
        } else {
          isActiveObserverScheduler = false;
        }

        /*obsD.disconnect();
              return;*/
      } else {
        isActiveObserverScheduler = false;
      }
    });
    observerDelivery.observe(document, {
      childList: true,
      subtree: true,
    });
  }

  setLoadingStyles();
  //addDeliveryObserver();
  addSchedulerObserver();
});
