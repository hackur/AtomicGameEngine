//
// Copyright (c) 2014-2015, THUNDERBEAST GAMES LLC All rights reserved
// LICENSE: Atomic Game Engine Editor and Tools EULA
// Please see LICENSE_ATOMIC_EDITOR_AND_TOOLS.md in repository root for
// license information: https://github.com/AtomicGameEngine/AtomicGameEngine
//

import EditorUI = require("./EditorUI");

class MainToolbar extends Atomic.UIWidget {

    translateButton: Atomic.UIButton;
    rotateButton: Atomic.UIButton;
    scaleButton: Atomic.UIButton;
    axisButton: Atomic.UIButton;
    playButton: Atomic.UIButton;

    constructor(parent: Atomic.UIWidget) {

        super();

        this.load("AtomicEditor/editor/ui/maintoolbar.tb.txt");

        this.translateButton = <Atomic.UIButton>this.getWidget("3d_translate");
        this.rotateButton = <Atomic.UIButton>this.getWidget("3d_rotate");
        this.scaleButton = <Atomic.UIButton>this.getWidget("3d_scale");

        this.axisButton = <Atomic.UIButton>this.getWidget("3d_axismode");

        this.playButton = <Atomic.UIButton>this.getWidget("maintoolbar_play");

        this.translateButton.value = 1;

        parent.addChild(this);

        this.subscribeToEvent("GizmoAxisModeChanged", (ev) => this.handleGizmoAxisModeChanged(ev));
        this.subscribeToEvent("GizmoEditModeChanged", (ev) => this.handleGizmoEditModeChanged(ev));
        this.subscribeToEvent(this, "WidgetEvent", (data) => this.handleWidgetEvent(data));
        this.subscribeToEvent("IPCPlayerQuit", (data) => {
            var skin = <Atomic.UISkinImage> this.playButton.getWidget("skin_image");
            skin.setSkinBg("PlayButton");
        });
    }

    handleGizmoAxisModeChanged(ev: Editor.GizmoAxisModeChangedEvent) {

        if (ev.toggle) return;

        if (ev.mode == Editor.AXIS_WORLD) {
            this.axisButton.value = 1;
            this.axisButton.text = "World";
        } else {
            this.axisButton.value = 0;
            this.axisButton.text = "Local";
        }

    }

    handleGizmoEditModeChanged(ev: Editor.GizmoEditModeChangedEvent) {

        this.translateButton.value = 0;
        this.rotateButton.value = 0;
        this.scaleButton.value = 0;

        switch (ev.mode) {
            case 1:
                this.translateButton.value = 1;
                break;
            case 2:
                this.rotateButton.value = 1;
                break;
            case 3:
                this.scaleButton.value = 1;
                break;
        }

    }

    handleWidgetEvent(ev: Atomic.UIWidgetEvent) {

        if (ev.type == Atomic.UI_EVENT_TYPE_CLICK && ev.target) {

            if (ev.target.id == "3d_translate" || ev.target.id == "3d_rotate" || ev.target.id == "3d_scale") {

                var mode = 1;
                if (ev.target.id == "3d_rotate")
                    mode = 2;
                else if (ev.target.id == "3d_scale")
                    mode = 3;

                this.sendEvent("GizmoEditModeChanged", { mode: mode });

                return true;

            } else if (ev.target.id == "3d_axismode") {

                EditorUI.getShortcuts().invokeGizmoAxisModeChanged(ev.target.value ? Editor.AXIS_WORLD : Editor.AXIS_LOCAL);
                return true;

            } else if (ev.target.id == "maintoolbar_play") {
                var editorMode = <Editor.EditorMode> this.getSubsystem("EditorMode");
                if (editorMode.isPlayerEnabled()) {
                    this.sendEvent("IPCPlayerExitRequest");
                } else {
                    EditorUI.getShortcuts().invokePlay();
                    var skin = <Atomic.UISkinImage> this.playButton.getWidget("skin_image");
                    skin.setSkinBg("StopButton");
                }
                return true;

            }

        }

    }

}



export = MainToolbar;
