---
title: Flutter로 손쉽게 좌우 스크롤 이동 버튼 구현하기
date: "2024-10-20T23:00:00.000Z"
template: "post"
draft: false
slug: "/posts/horizontal-scroll-buttons-with-flutter"
category: "Code Snippet"
tags:
  - "Code Snippet"
  - "Dart"
  - "Flutter"
  - "Flutter Web"
  - "LWIL"
description: "이번 글에서는 Flutter로 손쉽게 좌우 스크롤 이동 버튼을 구현하는 방법을 안내하고, 해당 버튼이 웹 환경에서만 나타나도록 설정하는 방법까지 다뤄보려고 합니다."
socialImage: "/media/horizontal-scroll-buttons-with-flutter.jpg"
---

최근에 Flutter의 `ListView` 위젯을 활용해 좌우로 스크롤할 수 있는 상품 목록 UI를 구현했습니다. 그러나, Flutter Web 환경에서는 사용자가 마우스를 이용해 콘텐츠를 스크롤하는 방식이 다소 불편할 수 있을 것 같다는 피드백을 받았습니다.

사용자의 경험을 개선하기 위해 **PM과 논의를 거친 결과, `ListView` 위젯 위에 좌우로 스크롤을 이동할 수 있는 버튼을 추가하기로 결정**했습니다. 이에 따라 웹 환경에서는 사용자가 마우스 드래그 대신 버튼 클릭을 통해 더 직관적이고 편리하게 콘텐츠를 탐색할 수 있게 되었고요.

이번 글에서는 Flutter로 손쉽게 좌우 스크롤 이동 버튼을 구현하는 방법을 안내하고, 해당 버튼이 웹 환경에서만 나타나도록 설정하는 방법까지 다뤄보려고 합니다.

## 좌우 스크롤 이동 버튼 구현하기

다음은 좌우로 스크롤할 수 있는 콘텐츠 위에 좌우 스크롤 이동 버튼을 추가하는 예제 코드입니다.

```dart
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class HorizontalScrollButtonRow extends StatelessWidget {
  final ScrollController controller;
  final double scrollAmount;
  final Widget child;

  const HorizontalScrollButtonRow({
    required this.controller,
    required this.scrollAmount,
    required this.child,
    super.key,
  });

  void _scrollLeft() {
    // 이미 맨 왼쪽에 도달했다면, 더 이상 스크롤하지 않도록 방지
    if (controller.offset <= 0.0) return;

    controller.animateTo(
      controller.offset - scrollAmount,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }

  void _scrollRight() {
    // 현재 스크롤 위치가 최대 스크롤 범위를 넘지 않도록 방지
    if (controller.offset >= controller.position.maxScrollExtent) return;

    controller.animateTo(
      controller.offset + scrollAmount,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }

  @override
  Widget build(BuildContext context) {
    // Web 환경이 아닌 경우에는 child 위젯을 그대로 반환
    if (!kIsWeb) return child;

    return Stack(
      children: <Widget>[
        Positioned.fill(child: child),
        Align(
          alignment: Alignment.center,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              _HorizontalScrollButton(
                onPressed: _scrollLeft,
                icon: Icons.chevron_left,
              ),
              _HorizontalScrollButton(
                onPressed: _scrollRight,
                icon: Icons.chevron_right,
              ),
            ],
          ),
        ),
      ],
    );
  }
}
```

`HorizontalScrollButtonRow` 위젯은 상품 목록과 같은 콘텐츠에 좌우 스크롤 이동 버튼을 추가합니다. 이 위젯은 세 가지 Props를 필요로 합니다:

- `controller`: 스크롤할 콘텐츠의 동작을 제어하기 위해서는 해당 콘텐츠의 `ScrollController`에 접근할 수 있어야 합니다. 해당 콘텐츠의 스크롤 위치와 범위 등을 알 수 있는 것은 물론, 버튼 클릭 시 스크롤 위치를 업데이트하는 데에도 `ScrollController`가 필요합니다.
- `scrollAmount`: 버튼 클릭 시 스크롤을 얼마나 많이 이동시킬지도 지정해야 합니다. 이동시키고 싶은 만큼 값을 조절할 수 있도록 구현했습니다.
- `child`: 좌우로 스크롤 가능한 콘텐츠를 포함하는 위젯입니다.

### 스크롤 동작 제어

```dart
void _scrollLeft() {
  // 이미 맨 왼쪽에 도달했다면, 더 이상 스크롤하지 않도록 방지
  if (controller.offset <= 0.0) return;

  controller.animateTo(
    controller.offset - scrollAmount,
    duration: const Duration(milliseconds: 300),
    curve: Curves.easeInOut,
  );
}

void _scrollRight() {
  // 현재 스크롤 위치가 최대 스크롤 범위를 넘지 않도록 방지
  if (controller.offset >= controller.position.maxScrollExtent) return;

  controller.animateTo(
    controller.offset + scrollAmount,
    duration: const Duration(milliseconds: 300),
    curve: Curves.easeInOut,
  );
}
```

`ScrollController`의 `animateTo` 메서드를 활용하면 스크롤 위치를 업데이트할 수 있습니다. 사용자가 버튼을 클릭하면 `scrollAmount`에서 지정한 만큼 스크롤을 이동시키기 위해 각각의 함수를 만들었고, 스크롤의 시작과 끝 지점에서는 더 이상 스크롤하지 않도록 처리해 불필요한 스크롤을 방지했습니다.

### 플랫폼별 조건부 렌더링

```dart
@override
Widget build(BuildContext context) {
  // Web 환경이 아닌 경우에는 child 위젯을 그대로 반환
  if (!kIsWeb) return child;

  return Stack(
    children: <Widget>[
      Positioned.fill(child: child),
      Align(
        alignment: Alignment.center,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            _HorizontalScrollButton(
              onPressed: _scrollLeft,
              icon: Icons.chevron_left,
            ),
            _HorizontalScrollButton(
              onPressed: _scrollRight,
              icon: Icons.chevron_right,
            ),
          ],
        ),
      ),
    ],
  );
}
```

Flutter의 `Stack` 위젯을 활용하면 스크롤할 콘텐츠 위에 버튼을 겹쳐 배치할 수 있습니다. 다만, 요구사항에 따르면 좌우 스크롤 이동 버튼은 웹 환경에서만 노출되어야 하므로, Flutter의 `kIsWeb` 상수를 사용해 현재 실행 중인 플랫폼이 웹인 경우에만 노출되도록 설정했습니다. 웹이 아닌 다른 플랫폼에서는 `child`만 반환하여 불필요한 리소스 낭비를 방지했습니다.

## 마치며

<figure class="float-left" style="width: 240px">
	<img src="/media/horizontal-scroll-buttons-with-flutter.jpg" alt="Horizontal Scroll Buttons With Flutter">
	<figcaption>Flutter로 구현한 좌우 스크롤 이동 버튼</figcaption>
</figure>

좌우 스크롤 이동 버튼을 추가함으로써, 웹 환경에서 사용자가 상품 목록을 더 직관적이고 편리하게 탐색할 수 있게 되었습니다. 결과적으로 같은 콘텐츠에 대한 사용자의 탐색 시간을 줄일 수 있었던 것은 물론, 구매 전환율 증가에도 미약하게나마 긍정적인 영향을 미칠 수 있게 되었고요.

앞으로도 **이러한 작은 디테일이 사용자의 경험을 개선하고, 궁극적으로는 서비스 가치를 높이는 중요한 역할을 한다는 점을 잊지 말아야겠다**는 다짐과 함께 이번 글을 마칩니다.
