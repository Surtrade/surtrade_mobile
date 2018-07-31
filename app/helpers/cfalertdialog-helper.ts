import { alert } from "tns-core-modules/ui/dialogs";
import {
  CFAlertDialog,
  DialogOptions,
  CFAlertActionAlignment,
  CFAlertActionStyle,
  CFAlertStyle
} from "nativescript-cfalert-dialog";

export class CFAlertDialogHelper {
  private cfalertDialog: CFAlertDialog;

  constructor() {
    this.cfalertDialog = new CFAlertDialog();
  }

  showAlert(blur: boolean): void {
    this.cfalertDialog.show({
      dialogStyle: CFAlertStyle.ALERT,
      title: "Alert! Run 4 your life! 😱",
      backgroundBlur: blur,
      onDismiss: () => console.log("showAlert dismissed")
    });
  }

  showNotification(msg: string = "Generic Message."): void {
    const options: DialogOptions = {
      dialogStyle: CFAlertStyle.NOTIFICATION,
      title: "This is a notification!",
      message: msg,
      backgroundBlur: true,
      onDismiss: dialog => console.log(`Dialog was dismissed: ${dialog}`),
      buttons: [{
        text: "Okay",
        buttonStyle: CFAlertActionStyle.POSITIVE,
        buttonAlignment: CFAlertActionAlignment.END,
        textColor: "#eee",
        backgroundColor: "#888",
        onClick: response => console.log(`Button pressed: ${response}`)
      }]
    };
    this.cfalertDialog.show(options);
  }

  showBottomSheet(shelf:string, title:string = "Your selection:"): boolean {
    let answer = false;
    const onSelection = response => {
      console.log("The response for shelf was: "+response);
      if (response == "Okay"){
        answer = true;
        console.log("Shelf answer updated to: "+answer);

        console.log("shelf return try: "+answer);
        return answer;
      }
      // alert({
      //   title: title,
      //   message: response,
      //   okButtonText: "Go"
      // });
    };

    const options: DialogOptions = {
      dialogStyle: CFAlertStyle.BOTTOM_SHEET,
      title: "Information available!",
      message: "Would you like to know more about "+shelf+"?",
      buttons: [
        {
          text: "Okay",
          buttonStyle: CFAlertActionStyle.POSITIVE,
          buttonAlignment: CFAlertActionAlignment.JUSTIFIED,
          onClick: onSelection
        },
        {
          text: "Nope",
          buttonStyle: CFAlertActionStyle.NEGATIVE,
          buttonAlignment: CFAlertActionAlignment.JUSTIFIED,
          onClick: onSelection
        }]
    };
    this.cfalertDialog.show(options);

    console.log("shelf return: "+answer);
    return answer;
  }

  showSimpleList(): void {
    const items: any = ["Tomato", "Potato", "Carrot", "Spinach"];
    const options: DialogOptions = {
      dialogStyle: CFAlertStyle.ALERT,
      title: "This is a simple list!",
      simpleList: {
        items: items,
        onClick: (dialogInterface, index) => {
          alert({
            title: "Your selection:",
            message: items[index],
            okButtonText: "OK"
          });
        }
      }
    };
    this.cfalertDialog.show(options);
  }

  showSingleChoiceList(): void {
    const items: any = ["Tomato", "Potato", "Carrot", "Spinach"];
    let selection: string;
    const options: DialogOptions = {
      dialogStyle: CFAlertStyle.ALERT,
      title: "This is a simple list!",
      singleChoiceList: {
        items: items,
        selectedItem: 2,
        onClick: (dialog, index) => {
          selection = items[index];
          console.log(`Option selected: ${selection}`);
        }
      },
      buttons: [
        {
          text: "Okay",
          buttonStyle: CFAlertActionStyle.POSITIVE,
          buttonAlignment: CFAlertActionAlignment.END,
          onClick: (pressedButton: string) => {
            alert({
              title: "You selected:",
              message: selection,
              okButtonText: "OK"
            });
          }
        }
      ]
    };
    this.cfalertDialog.show(options);
  }
}