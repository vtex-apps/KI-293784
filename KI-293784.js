$(document).ready(function () {
  function setLoadingStyles() {
    const style = document.createElement("style");
    style.innerHTML = `
  #containerSpinner {
    display: flex;
    align-items: center;
    justify-content: center;
  }

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

  function addLoadingApagar() {
    const scheduledDeliveryList = document.querySelector(
      ".vtex-omnishipping-1-x-scheduledDeliveryList"
    );
    scheduledDeliveryList.classList.add("vtex-omnishipping-1-x-hide");
    const spinner = document.createElement("div");
    spinner.setAttribute("id", "spinner");
    scheduledDeliveryList.parentElement.append(spinner);
  }

  function removeLoadingApagar() {
    const scheduledDeliveryList = document.querySelector(
      ".vtex-omnishipping-1-x-scheduledDeliveryList"
    );
    scheduledDeliveryList.classList.remove("vtex-omnishipping-1-x-hide");
    const spinnerElement = document.querySelectorAll("#spinner");
    spinnerElement.forEach((e) => e.remove());
  }

  function addLoadingPrender() {
    //console.log("addLoadingPrender");
    setTimeout(() => {
      const titles = [
        ...document.querySelectorAll(
          ".vtex-omnishipping-1-x-shippingSectionTitle"
        ),
      ];
      if (titles.length > 3) {
        const titlesToHide = titles.splice(titles.length - 2, titles.length);

        titlesToHide.forEach((title) => {
          title.classList.add("vtex-omnishipping-1-x-hide");
        });
        const glideContainer = document.querySelector(".glide-container");

        if (document.contains(glideContainer)) {
          glideContainer.classList.add("vtex-omnishipping-1-x-hide");
        }

        const deliveryPackagesOptions = document.querySelector(
          "#delivery-packages-options"
        );

        if (document.contains(deliveryPackagesOptions)) {
          deliveryPackagesOptions.classList.add("vtex-omnishipping-1-x-hide");
        }

        const shpAlert = document.querySelector(
          ".shp-alert.vtex-omnishipping-1-x-alert.shp-alert-delivery.shp-alert-schedule-unavailable"
        );
        if (document.contains(shpAlert)) {
          shpAlert.classList.add("vtex-omnishipping-1-x-hide");
        }

        const scheduledDelivery = document.querySelector(
          ".vtex-omnishipping-1-x-scheduledDelivery"
        );

        const containerSpinner = document.createElement("div");
        containerSpinner.setAttribute("id", "containerSpinner");
        const spinner = document.createElement("div");
        spinner.setAttribute("id", "spinner");
        containerSpinner.append(spinner);
        scheduledDelivery.parentElement.append(containerSpinner);
      }
    }, 100);
  }

  function removeLoadingPrender() {
    //console.log("removeLoadingPrender");
    const titles = [
      ...document.querySelectorAll(
        ".vtex-omnishipping-1-x-shippingSectionTitle"
      ),
    ];

    titles.forEach((title) => {
      if (title.classList.contains("vtex-omnishipping-1-x-hide")) {
        title.classList.remove("vtex-omnishipping-1-x-hide");
      }
    });
    const glideContainer = document.querySelector(".glide-container");

    if (
      document.contains(glideContainer) &&
      glideContainer.classList.contains("vtex-omnishipping-1-x-hide")
    ) {
      glideContainer.classList.add("vtex-omnishipping-1-x-hide");
    }

    const deliveryPackagesOptions = document.querySelector(
      "#delivery-packages-options"
    );

    if (
      document.contains(deliveryPackagesOptions) &&
      deliveryPackagesOptions.classList.contains("vtex-omnishipping-1-x-hide")
    ) {
      deliveryPackagesOptions.classList.add("vtex-omnishipping-1-x-hide");
    }

    const shpAlert = document.querySelector(
      ".shp-alert.vtex-omnishipping-1-x-alert.shp-alert-delivery.shp-alert-schedule-unavailable"
    );
    if (
      document.contains(shpAlert) &&
      shpAlert.classList.contains("vtex-omnishipping-1-x-hide")
    ) {
      shpAlert.classList.add("vtex-omnishipping-1-x-hide");
    }

    const spinnerElement = document.querySelectorAll("#spinner");
    spinnerElement.forEach((e) => e.remove());
  }

  function changeDeliveryWindow() {
    //console.log("changeDeliveryWindow()");
    vtexjs.checkout
      .getOrderForm()
      .then((orderForm) => {
        var shippingData = orderForm.shippingData;
        var hasDeliveryWindow = false;
        shippingData.logisticsInfo.forEach((logisticsInfo) => {
          //console.log("logisticsInfo", logisticsInfo);
          const selectedSla = logisticsInfo.selectedSla;
          logisticsInfo.slas.forEach((sla) => {
            //console.log("sla.deliveryWindow ", sla.deliveryWindow );
            if (sla.id === selectedSla) {
              if (sla.deliveryWindow) {
                sla.deliveryWindow = null;
                hasDeliveryWindow = true;
              }
            }
          });
        });

        if (hasDeliveryWindow) {
          //console.log("hasDeliveryWindow");
          addLoadingApagar();
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
            removeLoadingApagar();
          }, 1500);
        } else {
          removeLoadingApagar();
        }
      });
  }

  function addFakeDeliveyWindow() {
    //console.log("addFakeDeliveyWindow()");
    vtexjs.checkout
      .getOrderForm()
      .then((orderForm) => {
        var shippingData = orderForm.shippingData;
        if (shippingData.logisticsInfo.length > 1) {
          shippingData.logisticsInfo.forEach((logisticsInfo) => {
            const selectedSla = logisticsInfo.selectedSla;
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
        }
        return null;
      })
      .done(function () {
        removeLoadingPrender();
      });
  }

  function removeFakeDeliveyWindow() {
    vtexjs.checkout
      .getOrderForm()
      .then((orderForm) => {
        var shippingData = orderForm.shippingData;
        if (shippingData.logisticsInfo.length > 1) {
          shippingData.logisticsInfo.forEach((logisticsInfo) => {
            const selectedSla = logisticsInfo.selectedSla;
            logisticsInfo.slas.forEach((sla) => {
              if (sla.id === selectedSla) {
                sla.deliveryWindow = null;
                hasDeliveryWindow = true;
              }
            });
          });

          return vtexjs.checkout.sendAttachment("shippingData", shippingData);
        }
        return null;
      })
      .done(function () {
        removeLoadingPrender();
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
            //console.log("Apagar");
            changeDeliveryWindow();
          } else {
            //console.log("Prender");
            addLoadingPrender();
            addFakeDeliveyWindow();
            removeFakeDeliveyWindow();
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

  /*
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
      } else {
        isActiveObserverScheduler = false;
      }
    });
    observerDelivery.observe(document, {
      childList: true,
      subtree: true,
    });
  }*/

  setLoadingStyles();
  //addDeliveryObserver();
  addSchedulerObserver();
});
