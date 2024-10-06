function ScrollingArrayHorizontal(array) {
    if (!array)
        return;

    for (var i = 0; i < array.length; i++) {
        ScrollingHorizontal(array[i]);
    }
}

function ScrollingArrayVertical(array) {
    if (!array)
        return;

    for (var i = 0; i < array.length; i++) {
        ScrollingVertical(array[i]);
    }
}

function ScrollingHorizontal(obj) {
    if (!obj)
        return;

    // LEFT
    if (IsKirbyInLeftSide() && kirby.isWalkingLeft && background.transform.GetLeft() <= 0 && !AreObjectsCollidingArray(kirby.element, kirby.transform.GetLeft() - SCALE, kirby.transform.GetTop(), environnement)) {
        obj.TranslateXRound(1);
    }
    // RIGHT
    if (IsKirbyInRightSide() && kirby.isWalkingRight && background.transform.GetWidth() + background.transform.GetLeft() >= ParseInt(game, "width") && !AreObjectsCollidingArray(kirby.element, kirby.transform.GetLeft() + SCALE, kirby.transform.GetTop(), environnement)) {
        obj.TranslateXRound(-1);
    }
}

function ScrollingVertical(obj) {
    if (!obj)
        return;

    // TOP
    if (IsKirbyInTopSide() && kirby.isMovingUp && background.transform.GetTop() <= 0 && !AreObjectsCollidingArray(kirby.element, kirby.transform.GetLeft(), kirby.transform.GetTop() - SCALE, environnement)) {
        obj.TranslateYRound(1);
    }
    // BOTTOM
    if (IsKirbyInBottomSide() && kirby.isMovingDown && background.transform.GetHeight() + background.transform.GetTop() >= ParseInt(game, "height") && !AreObjectsCollidingArray(kirby.element, kirby.transform.GetLeft(), kirby.transform.GetTop() + SCALE, environnement)) {
        obj.TranslateYRound(-1);
    }
}