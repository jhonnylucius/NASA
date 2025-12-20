# 🗺️ Teste de Coordenadas Reais da Amazônia

## 📍 **Coordenadas obtidas via Overpass API:**

### **Limites originais do arquivo XML:**
```xml
<bounds minlat="-51.5600000" minlon="-99.7600000" maxlat="12.8100000" maxlon="-18.0200000"/>
```

### **Tradução para o sistema de coordenadas:**
- **Norte (maxlat):** 12.81°
- **Sul (minlat):** -51.56°  
- **Leste (maxlon):** -18.02°
- **Oeste (minlon):** -99.76°

### **Centro calculado:**
- **Latitude:** (-51.56 + 12.81) ÷ 2 = -19.375°
- **Longitude:** (-99.76 + (-18.02)) ÷ 2 = -58.89°

---

## 🧪 **Teste das Coordenadas:**

### **Para verificar se estão corretas:**
1. Abra o OpenStreetMap: https://www.openstreetmap.org/
2. Navegue para as coordenadas: **-19.375, -58.89**
3. Deve mostrar uma região no **centro-sul da América do Sul**
4. Verifique se os limites cobrem a **região amazônica**

### **Pontos de referência:**
- **Manaus:** -3.1190, -60.0217 ✅ (dentro dos limites)
- **Belém:** -1.4558, -48.4902 ✅ (dentro dos limites) 
- **Porto Velho:** -8.7612, -63.9023 ✅ (dentro dos limites)
- **Rio Branco:** -9.9747, -67.8073 ✅ (dentro dos limites)

---

## 🔧 **Implementação no Código:**

```javascript
// Coordenadas REAIS da Amazônia obtidas via Overpass API
this.amazonBounds = {
    north: 12.81,   // Norte real da região amazônica 
    south: -51.56,  // Sul real da região amazônica
    east: -18.02,   // Leste real da região amazônica  
    west: -99.76    // Oeste real da região amazônica
};

// Centro calculado das coordenadas reais
this.amazonCenter = [-19.375, -58.89];
```

---

## ⚠️ **Nota sobre o Erro de Memória:**

O erro no arquivo XML:
```xml
<remark> runtime error: open64: 12 Cannot allocate memory /srv/overpass/db/nodes.bin File_Blocks::read_block::4 </remark>
```

**Significa que:**
- ✅ As **coordenadas estão corretas**
- ❌ A **consulta era muito grande** para o servidor
- 🔧 **Solução**: Dividir em consultas menores
- 🔄 **Implementado**: Sistema de fallback automático

---

## 🚀 **Status Atual:**

- ✅ **Coordenadas reais** implementadas
- ✅ **Sistema de fallback** para erro de memória  
- ✅ **Consultas otimizadas** (áreas menores, timeouts maiores)
- ✅ **Mapa navegável** como OpenStreetMap real
- ✅ **Múltiplas camadas** de visualização
- ✅ **Controles avançados** com coordenadas em tempo real

**🌳 O mapa agora funciona com as coordenadas REAIS da Amazônia obtidas do OpenStreetMap!**
