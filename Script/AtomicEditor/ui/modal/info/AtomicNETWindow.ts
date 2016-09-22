//
// Copyright (c) 2014-2016 THUNDERBEAST GAMES LLC
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//

import EditorUI = require("../../EditorUI");
import ModalWindow = require("../ModalWindow");

class AtomicNETWindow extends ModalWindow {

    constructor() {

        super();

        this.settings = Atomic.UI_WINDOW_SETTINGS_DEFAULT & ~Atomic.UI_WINDOW_SETTINGS_CLOSE_BUTTON;

        // we're not calling this.init here as it calls resizeToFitContent
        // and center, which screw up the generated About text being resized

        this.text = "Atomic C# Requirements";
        this.load("AtomicEditor/editor/ui/atomicnetwindow.tb.txt");

        this.downloadButton = <Atomic.UIButton>this.getWidget("download_button");

        this.atomicnet_text = <Atomic.UIEditField>this.getWidget("atomicnet_text");
        this.atomicnet_text.text = this.generateAtomicNETText();

        this.resizeToFitContent();
        this.center();

    }

    handleWidgetEvent(ev: Atomic.UIWidgetEvent) {

        if (ev.type == Atomic.UI_EVENT_TYPE_CLICK) {

            var id = ev.target.id;

            if (id == "ok") {

                this.hide();

                return true;
            }

            if (id == "download_button") {

                this.hide();

                Atomic.fileSystem.systemOpen(Atomic.platform == "Windows" ?
                "https://www.visualstudio.com/en-us/products/visual-studio-community-vs.aspx" :
                "https://www.xamarin.com/download");

            }
        }
    }


    generateAtomicNETText(): string {

        var installText:string;

        var ideText:string = Atomic.platform == "Windows" ? "Visual Studio" : "Xamarin Studio";

        var installText = `Please install ${ideText} with <color #D4FB79>Xamarin.Android</color> and <color #D4FB79>Xamarin.iOS</color>`;

        this.downloadButton.text = `Download ${ideText}`;

        var text = "";

        text += `
Atomic C# is integrated with <color #D4FB79>Visual Studio</color> and <color #D4FB79>Xamarin Studio</color> to provide a first class editing, debugging, and deployment experience.

${installText}

<color #76D6FF>Visual Studio Code support is also coming soon!</color>

`;

        return text;

    }

    atomicnet_text: Atomic.UIEditField;
    downloadButton: Atomic.UIButton;
}

export = AtomicNETWindow;
