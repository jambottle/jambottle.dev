---
title: Flutter로 손쉽게 Linear Progress Bar 구현하기
date: "2024-11-30T13:20:00.000Z"
template: "post"
draft: false
slug: "/posts/linear-progress-bar-with-dot-indicator"
category: "Code Snippet"
tags:
  - "Code Snippet"
  - "Dart"
  - "Flutter"
  - "Flutter Web"
  - "LWIL"
description: "이번 글에서는 Flutter로 손쉽게 Linear Progress Bar를 구현하는 방법을 안내하고, Progress Bar가 가리키는 곳에 Dot Indicator를 위치시키는 방법까지 다뤄보려고 합니다."
socialImage: "/media/linear-progress-bar-with-dot-indicator.jpg"
---

최근에 Flutter의 `LinearProgressIndicator` 위젯을 활용해 회원의 멤버십 등급 현황을 나타내는 Progress Bar UI를 구현했습니다. 그런데, **해당 위젯의 스타일이 Material
Design을 강하게 의존하고 있다 보니 진행 상태를 보다 강조하기 위해서는 약간의 커스터마이징이 필요**했습니다.

이번 글에서는 Flutter로 손쉽게 Linear Progress Bar를 구현하는 방법을 안내하고, Progress Bar가 가리키는 곳에 Dot Indicator를 위치시키는 방법까지 다뤄보려고 합니다.

## Linear Progress Bar 구현하기

다음은 `LinearProgressIndicator` 위젯이 가리키는 곳에 Dot Indicator를 위치시키는 예제 코드입니다.

```dart
import 'dart:math';

import 'package:flutter/material.dart';

class LinearProgressBar extends StatelessWidget {
  final double value;

  const LinearProgressBar({
    required this.value,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final position = constraints.maxWidth * value;
        return Stack(
          alignment: Alignment.center,
          children: <Widget>[
            // Progress Bar
            Container(
              alignment: Alignment.center,
              width: double.infinity,
              height: 24.0,
              child: LinearProgressIndicator(
                value: value,
                backgroundColor: Colors.grey[300],
                color: Colors.red,
                minHeight: 8.0,
                borderRadius: BorderRadius.circular(4.0),
              ),
            ),

            // Dot Indicator
            Positioned(
              left: max(position - 7.0, 0.0),
              child: Container(
                alignment: Alignment.center,
                width: 14.0,
                height: 14.0,
                decoration: const BoxDecoration(
                  color: Colors.red,
                  shape: BoxShape.circle,
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}
```

`LinearProgressBar` 위젯은 아래의 두 가지 하위 위젯으로 구성됩니다:

- **Progress Bar**: Flutter의 `LinearProgressIndicator` 위젯을 활용해 진행 상태(`value`)를 시각적으로 표현합니다.
- **Dot Indicator**: Progress Bar가 가리키는 곳(`value`)에 위치시켜 진행 상태를 보다 강조하는 역할을 합니다.

### Progress Bar

```dart
@override
Widget build(BuildContext context) {
  return LayoutBuilder(
    builder: (context, constraints) {
      final position = constraints.maxWidth * value;
      return Stack(
        alignment: Alignment.center,
        children: <Widget>[
          // Progress Bar
          Container(
            alignment: Alignment.center,
            width: double.infinity,
            height: 24.0,
            child: LinearProgressIndicator(
              value: value,
              backgroundColor: Colors.grey[300],
              color: Colors.red,
              minHeight: 8.0,
              borderRadius: BorderRadius.circular(4.0),
            ),
          ),

          // Dot Indicator
          // ...
        ],
      );
    },
  );
}
```

Flutter의 `LinearProgressIndicator` 위젯을 활용하면, 0과 1 사이의 값을 `value`에 할당하는 것만으로도 기본적인 형태의 Progress Bar UI를 구현할 수 있습니다.
`value` 값을 기준으로 Dot Indicator와 위치를 맞추기 위해 해당 위젯의 너비를 최대(`double.infinity`)로 설정했습니다.

### Dot Indicator

```dart
@override
Widget build(BuildContext context) {
  return LayoutBuilder(
    builder: (context, constraints) {
      final position = constraints.maxWidth * value;
      return Stack(
        alignment: Alignment.center,
        children: <Widget>[
          // Progress Bar
          // ...

          // Dot Indicator
          Positioned(
            left: max(position - 7.0, 0.0),
            child: Container(
              alignment: Alignment.center,
              width: 14.0,
              height: 14.0,
              decoration: const BoxDecoration(
                color: Colors.red,
                shape: BoxShape.circle,
              ),
            ),
          ),
        ],
      );
    },
  );
}
```

Flutter의 `LayoutBuilder` 위젯의 `constraints`를 활용하면, 위젯이 차지할 수 있는 최대 너비(`constraints.maxWidth`)를 알 수 있습니다. 그 최대 너비와 `value`
값을 곱해 Dot Indicator가 위치할 지점을 계산하고, `Positioned` 위젯으로 계산한 지점에 위치시켰습니다.

이때, Dot Indicator가 일부 가려지거나 사라질 경우를 대비하여 X축 위치의 최솟값이 0이 되도록 설정했습니다.

## 마치며

<figure class="float-left" style="width: 240px">
	<img src="/media/linear-progress-bar-with-dot-indicator.jpg" alt="Linear Progress Bar With Dot Indicator">
	<figcaption>Flutter로 구현한 Linear Progress Bar</figcaption>
</figure>

Flutter의 `LinearProgressIndicator` 위젯과 Dot Indicator를 결합함으로써, 단순히 시각적으로 표현하는 것을 넘어 **사용자가 진행 상태를 더욱 직관적으로 이해할 수 있도록 도울 수
있게** 되었습니다.

특히 이번에는 회원의 멤버십 등급 현황을 나타내기 위해 이 위젯을 사용했는데, 회원이 본인의 등급 현황을 확인하는 것은 물론, 다음 등급에 대한 목표를 갖게 하는 데에도 유용하게 쓰일 걸로 예상 중입니다.

앞으로도 **이러한 작은 디테일이 사용자의 경험을 개선하고, 궁극적으로는 서비스 가치를 높이는 중요한 역할을 한다는 점을 잊지 말아야겠다**는 다짐과 함께 이번 글을 마칩니다.
