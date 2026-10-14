import { PARALAXE } from "../geometria";
import { Camada } from "./Camada";

/** Longe: a serra e a Chapada dos Guimarães com a cachoeira. Elemento de Cuiabá. */
export function Longe() {
  return (
    <Camada id="hero-longe" paralaxe={PARALAXE.longe}>
      <g strokeLinejoin="round" strokeLinecap="round">
        <path
          d="M820 650 C880 610 940 596 1010 598 C1070 600 1100 578 1160 572 C1230 566 1270 584 1340 580 C1410 576 1450 552 1520 552 C1570 552 1610 562 1660 568 L1660 960 L820 960 Z"
          fill="#B9DFD0"
          stroke="#5E9092"
          strokeWidth="3"
        />
        <g transform="translate(0 36)">
          <path
            d="M60 660 L96 548 Q102 528 122 526 L470 518 Q492 518 498 538 L520 600 L590 604 Q604 604 610 592 L628 560 Q636 548 652 548 L748 548 Q764 548 770 562 L812 660 Z"
            fill="#EC9F72"
            stroke="#8E5B4A"
            strokeWidth="3"
          />
          <path
            d="M470 518 Q492 518 498 538 L520 600 L502 600 L480 538 Z M748 548 Q764 548 770 562 L812 660 L792 660 L754 564 Z"
            fill="#D9845A"
          />
          <path
            d="M108 566 Q300 556 490 560 M98 598 Q300 590 512 596 M88 632 Q320 624 560 632 M640 590 Q700 584 770 588 M630 622 Q700 616 790 624"
            fill="none"
            stroke="#D07A50"
            strokeWidth="3"
            strokeDasharray="130 22 70 30"
          />
          <path
            d="M96 548 Q100 522 124 520 L470 512 Q494 512 500 532 L502 540 C494 552 480 552 474 544 C466 556 448 556 442 546 C432 558 414 558 408 548 C398 560 380 560 374 550 C362 560 346 560 340 550 L322 550 C314 560 298 560 292 550 C282 560 266 560 260 550 C250 560 232 560 226 550 C216 560 200 560 194 550 C184 560 166 560 160 550 C150 560 132 560 126 550 C116 560 100 558 96 548 Z"
            fill="#93CC98"
            stroke="#5E8F6A"
            strokeWidth="3"
          />
          <path
            d="M626 566 Q632 548 652 546 L748 546 Q766 546 772 562 L774 570 C766 580 752 580 746 572 C738 582 722 582 716 572 C706 582 690 582 684 572 C674 582 658 582 652 572 C644 582 630 580 626 566 Z"
            fill="#93CC98"
            stroke="#5E8F6A"
            strokeWidth="3"
          />
          <g fill="none">
            <path d="M331 546 C330 570 333 596 334 618" stroke="#5E9092" strokeWidth="18" />
            <path d="M331 546 C330 570 333 596 334 618" stroke="#DDF4FF" strokeWidth="12" />
            <path className="hero__cascata" d="M331 546 C330 570 333 596 334 618" stroke="#FFFFFF" strokeWidth="4" />
          </g>
          <g fill="#FFFFFF" stroke="#5E9092" strokeWidth="2.5">
            <circle cx="322" cy="618" r="9" />
            <circle cx="337" cy="622" r="11" />
            <circle cx="351" cy="617" r="8" />
          </g>
        </g>
      </g>
    </Camada>
  );
}
